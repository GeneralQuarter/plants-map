import type { PageAppSDK } from '@contentful/app-sdk';
import { Box, Button, Switch } from '@contentful/f36-components';
import { PlusIcon } from '@contentful/f36-icons';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import type { Entry } from 'contentful';
import {
  CRS,
  type Map as LeafletMap,
  type LeafletMouseEvent,
  type Polygon as LeafletPolygon,
  LineUtil,
  SVG,
} from 'leaflet';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Polygon, Polyline } from 'react-leaflet';
import POLYGONS from '../data/polygons';
import POLYLINES from '../data/polylines';
import { ContentType } from '../lib/contentful/content-type';
import { createCDAClient } from '../lib/contentful/create-cda-client';
import { createCMAClient } from '../lib/contentful/create-cma-client';
import { entryToHedge } from '../lib/contentful/entry-to-hedge';
import { entryToMapZone } from '../lib/contentful/entry-to-map-zone';
import { entryToPlant } from '../lib/contentful/entry-to-plant';
import { entryToRectangle } from '../lib/contentful/entry-to-rectangle';
import type { HedgeEntry } from '../lib/contentful/hedge.entry-skeleton';
import type { MapZoneEntry } from '../lib/contentful/map-zone.entry-skeleton';
import type { PlantEntry } from '../lib/contentful/plant.entry-skeleton';
import type { RectangleEntry } from '../lib/contentful/rectangle.entry-skeleton';
import { coordsToJSONtext } from '../lib/coords-to-json-text';
import { generateMapZone } from '../lib/generate-map-zone';
import { generateRectangle } from '../lib/leaflet/generate-rectangle';
import { useCreateSectorMutation } from '../lib/mutations/create-sector.mutation';
import { useDeadPlantMutation } from '../lib/mutations/dead-plant.mutation';
import { usePinPlantMutation } from '../lib/mutations/pin-plant.mutation';
import { usePlantPlantMutation } from '../lib/mutations/plant-plant.mutation';
import { useUpdateMapSectorGeoJSONMutation } from '../lib/mutations/update-map-sector-geojson.mutation';
import { useUpdateMapZoneCoordsMutation } from '../lib/mutations/update-map-zone-coords.mutation';
import { useUpdatePlantMutation } from '../lib/mutations/update-plant-position.mutation';
import { useUpdateRectangleCoordsMutation } from '../lib/mutations/update-rectangle-coords.mutation';
import { hedgesQueryKey, useHedges } from '../lib/queries/hedges.query';
import {
  mapSectorsQueryKey,
  useMapSectors,
} from '../lib/queries/map-sectors.query';
import {
  mapZonesWithCoordsQueryKey,
  useMapZonesWithCoordsQuery,
} from '../lib/queries/map-zones-with-coords.query';
import {
  plantsWithPositionQueryKey,
  usePlantsWithPositionQuery,
} from '../lib/queries/plants-with-position.query';
import {
  rectanglesWithCoordsQueryKey,
  useRectanglesWithCoordsQuery,
} from '../lib/queries/rectangles-with-coords.query';
import { useExportedIds } from '../lib/use-exported-ids';
import { useMeasurementGraph } from '../lib/use-measurement-graph';
import { useSelectedTags } from '../lib/use-selected-tags';
import { useTags } from '../lib/use-tags';
import type { Hedge } from '../models/hedge';
import type { MapZone } from '../models/map-zone';
import type { MeasuredPoint } from '../models/measured-point';
import type { Plant } from '../models/plant';
import type { Rectangle } from '../models/rectangle';
import Counts from './Counts';
import EditorMap from './editor-map';
import EntriesSearch from './/entries-search';
import Header from './header';
import LeftAside from './left-aside';
import HedgePolyline from './markers/hedge-polyline';
import MapSectorMarker from './markers/map-sector-marker';
import MapZoneMarker from './markers/map-zone.marker';
import MeasuredPointMarker from './markers/measured-point-marker';
import MeasurementPolyline from './markers/measurement-polyline';
import PlantMarker from './markers/plant-marker';
import RectangleMarker from './markers/rectangle-marker';
import PlantAside from './plant-aside';
import PointsExport from './points-export';
import PointsLoader from './points-loader';
import TagsSelector from './tags-selector';

interface MainProps {
  sdk: PageAppSDK;
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

  const [map, setMap] = useState<LeafletMap | undefined>(undefined);
  const { data: plants } = usePlantsWithPositionQuery(cdaClient);
  const { data: rectangles } = useRectanglesWithCoordsQuery(cdaClient);
  const { data: mapZones } = useMapZonesWithCoordsQuery(cdaClient);
  const { data: hedges } = useHedges(cdaClient);
  const { data: mapSectors } = useMapSectors(cdaClient);
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>(
    undefined,
  );
  const [measurementLines, addMeasure, removeMeasurement] =
    useMeasurementGraph();
  const { mutate: updatePlantPosition } = useUpdatePlantMutation(cmaClient);
  const { mutate: updateRectangleCoords } =
    useUpdateRectangleCoordsMutation(cmaClient);
  const { mutate: updateMapZoneCoords } =
    useUpdateMapZoneCoordsMutation(cmaClient);
  const { mutate: createMapSector } = useCreateSectorMutation(cmaClient);
  const { mutate: updateMapSectorGeoJSON } =
    useUpdateMapSectorGeoJSONMutation(cmaClient);
  const { mutate: _pinPlant } = usePinPlantMutation(cmaClient);
  const { mutate: _plantPlant } = usePlantPlantMutation(cmaClient);
  const { mutate: _deadPlant } = useDeadPlantMutation(cmaClient);
  const tags = useTags(cdaClient);
  const [selectedTags, toggleTag] = useSelectedTags();
  const [showOutlines, setShowOutlines] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showDeadPlants, setShowDeadPlants] = useState<boolean>(false);
  const [showCanopy, setShowCanopy] = useState<boolean>(false);
  const [showZones, setShowZones] = useState<boolean>(false);
  const [showMapSectors, setShowMapSectors] = useState<boolean>(false);
  const [measuredPoints, setMeasuredPoints] = useState<MeasuredPoint[]>([]);
  const [selectedMeasuredPoint, setSelectedMeasuredPoint] = useState<
    MeasuredPoint | undefined
  >(undefined);
  const [isExportSelecting, setIsExportSelecting] = useState<boolean>(false);
  const [exportedIds, toggleExportedIds, clearExportedIds] = useExportedIds();

  const selectedPlant = useMemo(() => {
    if (!plants) {
      return undefined;
    }

    return plants.find((p) => p.id === selectedPlantId);
  }, [selectedPlantId, plants]);

  const openPlant = (plantId?: string) => {
    if (!plantId) {
      return;
    }

    (async () => {
      const { entity } = await sdk.navigator.openEntry(plantId, {
        slideIn: { waitForClose: true },
      });
      queryClient.invalidateQueries({ queryKey: [plantsWithPositionQueryKey] });

      if (!entity?.fields.position) {
        setSelectedPlantId(undefined);
      }
    })();
  };

  const openRectangle = useCallback(
    async (rectangleId: string) => {
      await sdk.navigator.openEntry(rectangleId, {
        slideIn: { waitForClose: true },
      });
      queryClient.invalidateQueries({
        queryKey: [rectanglesWithCoordsQueryKey],
      });
    },
    [sdk, queryClient],
  );

  const openHedge = useCallback(
    async (hedgeId: string) => {
      await sdk.navigator.openEntry(hedgeId, {
        slideIn: { waitForClose: true },
      });
      queryClient.invalidateQueries({ queryKey: [hedgesQueryKey] });
    },
    [sdk, queryClient],
  );

  const openMapZone = useCallback(
    async (mapZoneId: string) => {
      await sdk.navigator.openEntry(mapZoneId, {
        slideIn: { waitForClose: true },
      });
      queryClient.invalidateQueries({ queryKey: [mapZonesWithCoordsQueryKey] });
    },
    [sdk, queryClient],
  );

  const openMapSector = useCallback(
    async (mapSectorId: string) => {
      await sdk.navigator.openEntry(mapSectorId, {
        slideIn: { waitForClose: true },
      });
      queryClient.invalidateQueries({ queryKey: [mapSectorsQueryKey] });
    },
    [sdk, queryClient],
  );

  const plantClicked = (plant: Plant, event: MouseEvent) => {
    if (isExportSelecting) {
      toggleExportedIds(plant.id);
      return;
    }

    if (!event.shiftKey) {
      setSelectedPlantId(plant.id);
      return;
    }

    if (!selectedPlant) {
      return;
    }

    if (!selectedPlant.position || !plant.position) {
      return;
    }

    addMeasure(
      { id: selectedPlant.id, position: selectedPlant.position },
      { id: plant.id, position: plant.position },
    );
  };

  const measuredPointClick = (
    e: LeafletMouseEvent,
    measuredPoint: MeasuredPoint,
  ) => {
    if (e.originalEvent.ctrlKey) {
      if (selectedPlant) {
        const newPlant = { ...selectedPlant, position: measuredPoint.coords };
        updatePlantPosition(newPlant);
      }

      let text = `[${measuredPoint.coords[1]}, ${measuredPoint.coords[0]}],`;
      if (e.originalEvent.shiftKey && measuredPoint.description) {
        const allCoords = measuredPoints
          .filter((mp) => mp.description === measuredPoint.description)
          .map((mp) => mp.coords);
        text = coordsToJSONtext(allCoords);
      }
      navigator.clipboard.writeText(text);
      return;
    }

    if (!selectedMeasuredPoint) {
      setSelectedMeasuredPoint(measuredPoint);
      return;
    }

    if (selectedMeasuredPoint.name === measuredPoint.name) {
      return;
    }

    addMeasure(
      {
        id: selectedMeasuredPoint.name,
        position: selectedMeasuredPoint.coords,
      },
      { id: measuredPoint.name, position: measuredPoint.coords },
    );
    setSelectedMeasuredPoint(undefined);
  };

  const searchPlantClicked = async (plant: Plant) => {
    let newPlant = plant;

    if (!newPlant.position) {
      const center = map?.getCenter();
      const newPosition = selectedPlant
        ? selectedPlant.position
        : center && ([center.lat, center.lng] as [number, number]);

      if (!newPosition) {
        return;
      }

      newPlant = { ...plant, position: [...newPosition] };
      updatePlantPosition(newPlant);
    }

    setSelectedPlantId(newPlant.id);

    if (!newPlant.position) {
      return;
    }

    map?.flyTo(newPlant.position, 23);
  };

  const searchRectangleClicked = async (rectangle: Rectangle) => {
    let newRectangle = rectangle;

    if (!newRectangle.coords) {
      const center = map?.getCenter();

      if (!center) {
        return;
      }

      newRectangle = {
        ...rectangle,
        coords: generateRectangle(
          [center.lat, center.lng],
          rectangle.width,
          rectangle.length,
        ),
      };
      updateRectangleCoords(newRectangle);
    }

    if (!newRectangle.coords) {
      return;
    }

    map?.flyTo(newRectangle.coords[0], 20);
  };

  const searchHedgeClicked = async (hedge: Hedge) => {
    map?.flyTo(LineUtil.polylineCenter(hedge.coords, CRS.Simple), 22);
  };

  const searchMapZoneClicked = async (mapZone: MapZone) => {
    let newMapZone = mapZone;

    if (!newMapZone.coords) {
      const center = map?.getCenter();

      if (!center) {
        return;
      }

      newMapZone = {
        ...newMapZone,
        coords: generateMapZone([center.lat, center.lng], mapZone.orientation),
      };
      updateMapZoneCoords(newMapZone);
    }

    if (!newMapZone.coords) {
      return;
    }

    map?.flyTo(newMapZone.coords[0], 20);
  };

  // biome-ignore lint/suspicious/noExplicitAny: Can be a bunch of different types
  const searchEntryClicked = (entry: Entry<any>) => {
    const contentType = entry.sys.contentType.sys.id as ContentType;

    switch (contentType) {
      case ContentType.Plant:
        searchPlantClicked(entryToPlant(entry as PlantEntry));
        break;
      case ContentType.Rectangle:
        searchRectangleClicked(entryToRectangle(entry as RectangleEntry));
        break;
      case ContentType.Hedge:
        searchHedgeClicked(entryToHedge(entry as HedgeEntry));
        break;
      case ContentType.MapZone:
        searchMapZoneClicked(entryToMapZone(entry as MapZoneEntry));
        break;
    }
  };

  const pinPlant = useCallback(
    (plantId: string) => {
      return new Promise((resolve) => {
        _pinPlant(plantId, {
          onSettled: resolve,
        });
      });
    },
    [_pinPlant],
  );

  const plantPlant = useCallback(
    (plantId: string, date: Date) => {
      return new Promise((resolve) => {
        _plantPlant(
          { plantId, date },
          {
            onSettled: resolve,
          },
        );
      });
    },
    [_plantPlant],
  );

  const deadPlant = useCallback(
    (plantId: string, date: Date) => {
      return new Promise((resolve) => {
        _deadPlant(
          { plantId, date },
          {
            onSettled: resolve,
          },
        );
      });
    },
    [_deadPlant],
  );

  const quickActionClicked = useCallback(
    async (plantId: string, action: string, date?: Date) => {
      try {
        switch (action) {
          case 'pin':
            await pinPlant(plantId);
            break;
          case 'plant':
            if (!date) {
              break;
            }

            await plantPlant(plantId, date);
            break;
          case 'dead':
            if (!date) {
              break;
            }

            await deadPlant(plantId, date);
            break;
          default:
            break;
        }
      } catch (_e) {}
    },
    [pinPlant, plantPlant, deadPlant],
  );

  const filteredPlants = useMemo(() => {
    if (showDeadPlants) {
      return plants;
    }

    return plants?.filter((p) => !p.tags.includes('dead'));
  }, [plants, showDeadPlants]);

  const onMapZoneMarkerClicked = useCallback(
    (mapZone: MapZone) => {
      return (e: MouseEvent) => {
        if (e.shiftKey && mapZone.coords) {
          const newOrientation =
            mapZone.orientation === 'landscape' ? 'portrait' : 'landscape';
          updateMapZoneCoords({
            ...mapZone,
            orientation: newOrientation,
            coords: generateMapZone(mapZone.coords[0], newOrientation),
          });
        } else {
          openMapZone(mapZone.id);
        }
      };
    },
    [openMapZone, updateMapZoneCoords],
  );

  const onAddSectorClick = useCallback(() => {
    map?.pm.enableDraw('Polygon');
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on('pm:create', (e) => {
      createMapSector({
        geojson: (
          e.layer as LeafletPolygon
        ).toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>,
      });
      e.layer.remove();
    });

    return () => {
      map.off('pm:create');
    };
  }, [map, createMapSector]);

  return (
    <Container as="div">
      <Header>
        <EntriesSearch
          cdaClient={cdaClient}
          onEntryClick={searchEntryClicked}
        />
        <Button startIcon={<PlusIcon />} onClick={onAddSectorClick}>
          Add sector
        </Button>
        <PointsLoader setMeasuredPoints={setMeasuredPoints} />
        <PointsExport
          exportedIds={exportedIds}
          isExportSelecting={isExportSelecting}
          setIsExportSelecting={setIsExportSelecting}
          plants={plants}
          clearExportedIds={clearExportedIds}
        />
      </Header>
      <PlantAside
        plant={selectedPlant}
        open={!!selectedPlant}
        onEditClick={openPlant}
        onCloseClick={() => setSelectedPlantId(undefined)}
        onQuickAction={quickActionClicked}
        tags={tags}
        selectedTags={selectedTags}
      />
      <LeftAside padding="spacingM" flexDirection="column" gap="spacingM">
        <Counts plants={plants} />
        <Switch
          isChecked={showLabels}
          onChange={() => setShowLabels(!showLabels)}
        >
          Show plant labels
        </Switch>
        <Switch
          isChecked={showOutlines}
          onChange={() => setShowOutlines(!showOutlines)}
        >
          Show non pinned plants
        </Switch>
        <Switch
          isChecked={showDeadPlants}
          onChange={() => setShowDeadPlants(!showDeadPlants)}
        >
          Show dead plants
        </Switch>
        <Switch
          isChecked={showCanopy}
          onChange={() => setShowCanopy(!showCanopy)}
        >
          Show canopy
        </Switch>
        <Switch isChecked={showZones} onChange={() => setShowZones(!showZones)}>
          Show zones
        </Switch>
        <Switch
          isChecked={showMapSectors}
          onChange={() => setShowMapSectors(!showMapSectors)}
        >
          Show map sectors
        </Switch>
        <TagsSelector
          tags={tags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
        />
      </LeftAside>
      <EditorMap setMap={setMap}>
        {POLYGONS.map((polygon) => (
          <Polygon
            key={polygon.label}
            positions={polygon.positions}
            pathOptions={polygon.pathOptions}
            renderer={fullRenderer}
            pmIgnore={true}
          />
        ))}
        {POLYLINES.map((polyline) => (
          <Polyline
            key={polyline.label}
            positions={polyline.positions}
            pathOptions={polyline.pathOptions}
            renderer={fullRenderer}
            pmIgnore={true}
          />
        ))}
        {measuredPoints.map((point) => (
          <MeasuredPointMarker
            key={point.name}
            point={point}
            renderer={fullRenderer}
            onClick={(e) => measuredPointClick(e, point)}
          />
        ))}
        {hedges?.map((hedge) => (
          <HedgePolyline
            key={hedge.id}
            hedge={hedge}
            renderer={fullRenderer}
            onClick={() => openHedge(hedge.id)}
          />
        ))}
        {filteredPlants?.map((plant) => (
          <PlantMarker
            key={plant.id}
            plant={plant}
            renderer={fullRenderer}
            selected={selectedPlant ? plant.id === selectedPlant.id : false}
            exportSelected={exportedIds.includes(plant.id)}
            onClick={(e) => plantClicked(plant, e)}
            onPositionChange={(newPosition) =>
              updatePlantPosition({
                ...plant,
                position: [newPosition.lat, newPosition.lng],
              })
            }
            selectedTags={selectedTags}
            showOutlines={showOutlines}
            showLabels={showLabels}
            showCanopy={showCanopy}
          />
        ))}
        {rectangles &&
          filteredPlants &&
          rectangles.map((rectangle) => (
            <RectangleMarker
              key={rectangle.id}
              rectangle={rectangle}
              onCoordsChange={(newCoords) =>
                updateRectangleCoords({ ...rectangle, coords: newCoords })
              }
              renderer={fullRenderer}
              onClick={() => openRectangle(rectangle.id)}
            />
          ))}
        {showZones &&
          mapZones &&
          filteredPlants &&
          mapZones.map((mapZone) => (
            <MapZoneMarker
              key={mapZone.id}
              mapZone={mapZone}
              onCoordsChange={(newCoords) =>
                updateMapZoneCoords({ ...mapZone, coords: newCoords })
              }
              renderer={fullRenderer}
              onClick={onMapZoneMarkerClicked(mapZone)}
            />
          ))}
        {showMapSectors &&
          mapSectors &&
          filteredPlants &&
          mapSectors.map((mapSector) => (
            <MapSectorMarker
              key={mapSector.id}
              mapSector={mapSector}
              onGeoJsonChange={(newGeoJSON) =>
                updateMapSectorGeoJSON({ ...mapSector, geojson: newGeoJSON })
              }
              renderer={fullRenderer}
              onClick={() => openMapSector(mapSector.id)}
            />
          ))}
        {measurementLines.map((line) => (
          <MeasurementPolyline
            key={line.id}
            line={line}
            tooltipClick={() => {
              removeMeasurement(line.id.split('->') as [string, string]);
            }}
          />
        ))}
      </EditorMap>
    </Container>
  );
};

export default Main;
