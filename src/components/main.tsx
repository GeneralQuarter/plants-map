import { PageExtensionSDK } from '@contentful/app-sdk';
import { Map, SVG } from 'leaflet';
import { FC, useMemo, useState } from 'react';
import POLYGONS from '../data/polygons';
import POLYLINES from '../data/polylines';
import { createCDAClient } from '../lib/contentful/create-cda-client';
import { useMeasurementGraph } from '../lib/use-measurement-graph';
import { Plant } from '../models/plant';
import { ContentType } from '../lib/contentful/content-type';
import EditorMap from './editor-map';
import EntriesSearch from './/entries-search';
import Header from './header';
import MeasurementPolyline from './markers/measurement-polyline';
import PlantMarker from './markers/plant-marker';
import PlantAside from './plant-aside';
import { Entry } from 'contentful';
import styled from '@emotion/styled';
import { Box } from '@contentful/f36-components';
import { Polygon, Polyline } from 'react-leaflet';
import { plantsWithPositionQueryKey, usePlantsWithPositionQuery } from '../lib/queries/plants-with-position.query';
import { createCMAClient } from '../lib/contentful/create-cma-client';
import { useUpdatePlantMutation } from '../lib/mutations/update-plant-position.mutation';
import { entryToPlant } from '../lib/contentful/entry-to-plant';
import { PlantEntry } from '../lib/contentful/plant-entry';
import { useQueryClient } from 'react-query';
import { rectanglesWithCoordsQueryKey, useRectanglesWithCoordsQuery } from '../lib/queries/rectangles-with-coords.query';
import RectangleMarker from './/markers/rectangle-marker';
import { useUpdateRectangleCoordsMutation } from '../lib/mutations/update-rectangle-coords.mutation';
import { Rectangle } from '../models/rectangle';
import { generateRectangle } from '../lib/leaflet/generate-rectangle';
import { entryToRectangle } from '../lib/contentful/entry-to-rectangle';
import { RectangleEntry } from '../lib/contentful/rectangle-entry';
import { useTags } from '../lib/use-tags';

interface MainProps {
  sdk: PageExtensionSDK;
}

const Container = styled(Box)`
  height: 100vh;
  width: 100vw;
  position: absolute;
  overflow: hidden;
`;

const fullRenderer = new SVG({ padding: 1 });

const Main: FC<MainProps> = ({ sdk }) => {
  const queryClient = useQueryClient();

  const cdaClient = useMemo(() => {
    return createCDAClient(sdk);
  }, [sdk]);

  const cmaClient = useMemo(() => {
    return createCMAClient(sdk);
  }, [sdk]);

  const [map, setMap] = useState<Map | undefined>(undefined);
  const {data: plants} = usePlantsWithPositionQuery(cdaClient);
  const {data: rectangles} = useRectanglesWithCoordsQuery(cdaClient);
  const [selectedPlant, setSelectedPlant] = useState<Plant | undefined>(undefined);
  const [measurementLines, addMeasure, removeMeasurement] = useMeasurementGraph();
  const {mutate: updatePlantPosition} = useUpdatePlantMutation(cmaClient);
  const {mutate: updateRectangleCoords} = useUpdateRectangleCoordsMutation(cmaClient);
  const tags = useTags(cdaClient);
  
  const openPlant = (plantId?: string) => {
    if (!plantId) {
      return;
    }

    (async () => {
      const { entity } = await sdk.navigator.openEntry(plantId, {slideIn: { waitForClose: true }});
      queryClient.invalidateQueries(plantsWithPositionQueryKey);

      if (!entity?.fields.position) {
        setSelectedPlant(undefined);
      }
    })();
  }

  const openRectangle = async (rectangleId: string) => {
    await sdk.navigator.openEntry(rectangleId, {slideIn: { waitForClose: true }});
    queryClient.invalidateQueries(rectanglesWithCoordsQueryKey);
  }

  const plantClicked = (plant: Plant, event: MouseEvent) => {
    if (!event.shiftKey) {
      setSelectedPlant(plant);
      return;
    }

    if (!selectedPlant) {
      return;
    }

    if (!selectedPlant.position || !plant.position) {
      return;
    }
    
    addMeasure({id: selectedPlant.id, position: selectedPlant.position}, {id: plant.id, position: plant.position});
  }

  const searchPlantClicked = async (plant: Plant) => {
    let newPlant = plant;

    if (!newPlant.position) {
      const center = map?.getCenter();

      if (!center) {
        return;
      }

      newPlant = {...plant, position: [center.lat, center.lng] as [number, number]};
      updatePlantPosition(newPlant);
    }

    setSelectedPlant(newPlant);

    if (!newPlant.position) {
      return;
    }

    map?.flyTo(newPlant.position, 23);
  }

  const searchRectangleClicked = async (rectangle: Rectangle) => {
    let newRectangle = rectangle;

    if (!newRectangle.coords) {
      const center = map?.getCenter();

      if (!center) {
        return;
      }

      newRectangle = {...rectangle, coords: generateRectangle([center.lat, center.lng], rectangle.width, rectangle.length)};
      updateRectangleCoords(newRectangle);
    }

    if (!newRectangle.coords) {
      return;
    }

    map?.flyTo(newRectangle.coords[0], 20);
  }

  const searchEntryClicked = (entry: Entry<unknown>) => {
    const contentType = entry.sys.contentType.sys.id as ContentType;

    switch (contentType) {
      case ContentType.Plant:
        searchPlantClicked(entryToPlant(entry as PlantEntry));
        break;
      case ContentType.Rectangle:
        searchRectangleClicked(entryToRectangle(entry as RectangleEntry));
        break;
    }
  }

  return <Container as="div">
    <Header>
      <EntriesSearch cdaClient={cdaClient} onEntryClick={searchEntryClicked} />
    </Header>
    <PlantAside 
      plant={selectedPlant} 
      open={!!selectedPlant} 
      onEditClick={openPlant} 
      onCloseClick={() => setSelectedPlant(undefined)} 
      tags={tags}
    />
    <EditorMap setMap={setMap}>
      {POLYGONS.map(polygon => (
        <Polygon key={polygon.label} positions={polygon.positions} pathOptions={polygon.pathOptions} renderer={fullRenderer} pmIgnore={true} />
      ))}
      {POLYLINES.map(polyline => (
        <Polyline key={polyline.label} positions={polyline.positions} pathOptions={polyline.pathOptions} renderer={fullRenderer} pmIgnore={true} />
      ))}
      {rectangles && rectangles.map(rectangle => (
        <RectangleMarker key={rectangle.id}
          rectangle={rectangle}
          onCoordsChange={newCoords => updateRectangleCoords({...rectangle, coords: newCoords})}
          renderer={fullRenderer}
          onClick={() => openRectangle(rectangle.id)}
        />
      ))}
      {plants && plants.map(plant => (
        <PlantMarker key={plant.id}
          plant={plant}
          renderer={fullRenderer}
          selected={selectedPlant ? plant.id === selectedPlant.id : false}
          onClick={e => plantClicked(plant, e)}
          onPositionChange={newPosition => updatePlantPosition({...plant, position: [newPosition.lat, newPosition.lng]})}
        />
      ))}
      {measurementLines.map(line => (
        <MeasurementPolyline key={line.id} line={line} tooltipClick={() => {
          removeMeasurement(line.id.split('->') as [string, string])
        }} />
      ))}
    </EditorMap>
  </Container>;
}

export default Main;