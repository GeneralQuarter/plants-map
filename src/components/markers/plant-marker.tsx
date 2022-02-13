import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Tooltip, useMapEvent } from 'react-leaflet';
import { Circle as LeafletCircle, LatLng, PathOptions, Renderer } from 'leaflet';
import HeightTriangle from '../height-triangle';
import { Plant } from '../../models/plant';
import { SelectedTag } from '../../models/selected-tag';
import { colorFromHueIndex } from '../../lib/color-from-hue-index';

export interface PlantMarkerProps {
  plant: Plant;
  onPositionChange?: (newPosition: LatLng) => void;
  onClick?: (event: MouseEvent) => void;
  selected?: boolean;
  renderer: Renderer;
  selectedTags: SelectedTag[];
  showOutlines?: boolean;
}

export default function PlantMarker({ plant, onPositionChange, onClick, selected, renderer, selectedTags, showOutlines }: PlantMarkerProps) {
  const circleRef = useRef<LeafletCircle | null>(null);
  const [showLabel, setShowlabel] = useState(false);
  const [locked, setLocked] = useState(true);
  const [newPosition, setNewPosition] = useState<LatLng | null>(null);

  const planted = useMemo(() => {
    return plant.tags.includes('planted');
  }, [plant.tags]);

  const eventHandlers = useMemo(() => ({
    contextmenu() {
      // disable dragging on planted trees
      if (planted) {
        setLocked(true);
        return;
      }

      if (!locked && newPosition) {
        onPositionChange?.(newPosition);
        setNewPosition(null);
      }

      setLocked(!locked);
    },
    click(e: {target: LeafletCircle, originalEvent: MouseEvent}) {
      if (e.target.pm.dragging()) {
        return;
      }

      onClick?.(e.originalEvent);
    },
    'pm:dragend': (e: {target: LeafletCircle}) => {
      setNewPosition(e.target.getLatLng());
    }
  }), [locked, newPosition, planted, onClick, onPositionChange]);

  const updateShowLabel = () => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    const { width } = (circle as any)._path.getBoundingClientRect();

    if (width >= 72) {
      if (!showLabel) {
        setShowlabel(true);
      }
    } else {
      if (showLabel) {
        setShowlabel(false)
      }
    }
  }

  const isPlanted = useMemo(() => {
    return plant.tags.includes('planted');
  }, [plant.tags]);

  const fillColor = useMemo(() => {
    if (isPlanted) {
      return '#33691e';
    }

    const firstSelectedTag = selectedTags.find(t => plant.tags.includes(t.id));

    if (!firstSelectedTag) {
      return 'gray';
    }

    return colorFromHueIndex(firstSelectedTag.hueIndex, 1);
  }, [plant, selectedTags, isPlanted]);

  useMapEvent('moveend', updateShowLabel);

  useEffect(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    if (locked) {
      setTimeout(() => {
        circle.pm.disableLayerDrag();
      }, 0)
    } else {
      circle.pm.enableLayerDrag();
    }
  }, [circleRef, locked]);

  const isPinned = useMemo(() => {
    return plant.tags.includes('jalonne');
  }, [plant.tags]);

  const color = useMemo(() => {
    if (selected) {
      return `blue`;
    }

    if (isPlanted) {
      return '#33691e';
    }

    if (showOutlines) {
      if (!isPlanted && !isPinned) {
        return `#a30000`;
      }

      if (!isPinned) {
        return `#000051`;
      }
    }

    return `gray`;
  }, [selected, showOutlines, isPlanted, isPinned]);

  const pathOptions = useMemo<PathOptions>(() => {
    return {
      color,
      fillColor: !locked ? 'blue' : fillColor,
    }
  }, [color, locked, fillColor]);
  
  return (
    <Circle center={plant.position ?? [0, 0]} 
      radius={plant.width / 2}
      ref={circleRef}
      eventHandlers={eventHandlers}
      pathOptions={pathOptions} 
      weight={1}
      renderer={renderer}>
      {showLabel && 
        <Tooltip direction="center" interactive={false} permanent={true} className="plant-label">
          <div className="code">{plant.code}</div>
          <div className="height">{plant.height}</div>
          <div className="plant-center"></div>
          <HeightTriangle height="40" width="40" className="triangle" />
        </Tooltip>
      }
    </Circle>
  )
}