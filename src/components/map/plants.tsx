import { FC, useMemo } from "react";
import circle from "@turf/circle";
import { Source, Layer } from "react-map-gl/maplibre";
import { Plant } from "../../models/plant";

type PlantsProps = {
  plants: Plant[];
  showCanopy: boolean;
};

const plantsToFeatureCollection = (
  plants: Plant[],
  showCanopy: boolean
) => {
  return {
    type: "FeatureCollection",
    features: plants.map((plant) => {
      return circle(
        [plant.position?.[1] ?? 0, plant.position?.[0] ?? 0],
        (showCanopy || plant.width < 2 ? plant.width : 2) / 2000,
        {
          properties: {
            id: plant.id,
            code: plant.code,
          },
        }
      );
    }),
  };
};

const Plants: FC<PlantsProps> = ({ plants, showCanopy }) => {
  const plantsFeatureCollection = useMemo(
    () => plantsToFeatureCollection(plants, showCanopy),
    [plants, showCanopy]
  );

  return (
    <Source id="plants" type="geojson" data={plantsFeatureCollection}>
      <Layer
        id="plant-outlines"
        type="line"
        paint={{
          "line-color": "gray",
        }}
      />
      <Layer
        id="plant-fill"
        type="fill"
        paint={{
          "fill-color": "gray",
          "fill-opacity": 0.2,
        }}
      />
      <Layer
        id="plant-codes"
        type="symbol"
        layout={{
          "text-field": ["get", "code"],
        }}
      />
    </Source>
  );
};

export default Plants;
