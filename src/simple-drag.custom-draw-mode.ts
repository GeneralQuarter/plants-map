import {
  DrawCustomMode,
  constants as Constants,
  DrawCustomModeThis,
  lib as Lib,
  MapMouseEvent,
  MapTouchEvent,
} from "@mapbox/mapbox-gl-draw";
import { LngLat } from "react-map-gl";

type SimpleDragCustomDrawModeState = {
  dragMoveLocation: LngLat | null;
  dragMoving: boolean;
  canDragMove: boolean;
  initiallySelectedFeaturesIds: string[];
};

type SimpleDragCustomModeOptions = {
  featureIds: string[];
};

interface ISimpleDragCustomDrawMode
  extends DrawCustomMode<
    SimpleDragCustomDrawModeState,
    SimpleDragCustomModeOptions
  > {
  fireUpdate(this: DrawCustomModeThis & this): void;
  stopExtendedInteractions(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState
  ): void;
  clickAnywhere(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  clickOnFeature(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  startOnActiveFeature(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  dragMove(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  onClickOrTap(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  onMouseDownOrTouchStart(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
  onMouseUpOrTouchEnd(
    this: DrawCustomModeThis & this,
    state: SimpleDragCustomDrawModeState,
    e: MapMouseEvent | MapTouchEvent
  ): void;
}

const SimpleDragCustomDrawMode: ISimpleDragCustomDrawMode = {
  onSetup(opts: SimpleDragCustomModeOptions) {
    const state: SimpleDragCustomDrawModeState = {
      dragMoveLocation: null,
      dragMoving: false,
      canDragMove: false,
      initiallySelectedFeaturesIds: opts.featureIds ?? [],
    };

    this.setSelected(
      state.initiallySelectedFeaturesIds.filter(
        (id) => this.getFeature(id) !== undefined
      )
    );

    return state;
  },

  fireUpdate() {
    this.map.fire(Constants.events.UPDATE, {
      action: Constants.updateActions.MOVE,
      features: this.getSelected().map((f) => f.toGeoJSON()),
    });
  },

  stopExtendedInteractions(state) {
    this.map.dragPan.enable();

    state.canDragMove = false;
    state.dragMoving = false;
  },

  onStop() {
    Lib.doubleClickZoom.enable(this);
  },

  onMouseMove(state, e) {
    const isFeature = Lib.CommonSelectors.isFeature(e);
    if (isFeature && state.dragMoving) this.fireUpdate();

    this.stopExtendedInteractions(state);

    return true;
  },

  onMouseOut(state) {
    if (state.dragMoving) return this.fireUpdate();

    return true;
  },

  onTap(state, e) {
    this.onClickOrTap(state, e);
  },

  onClick(state, e) {
    this.onClickOrTap(state, e);
  },

  onClickOrTap(state, e) {
    if (Lib.CommonSelectors.noTarget(e)) return this.clickAnywhere(state, e);
    if (Lib.CommonSelectors.isFeature(e)) return this.clickOnFeature(state, e);
  },

  startOnActiveFeature(state, e) {
    this.stopExtendedInteractions(state);

    this.map.dragPan.disable();

    this.doRender(e.featureTarget?.properties?.id);

    state.canDragMove = true;
    state.dragMoveLocation = e.lngLat;
  },

  clickAnywhere(state, e) {
    const wasSelected = this.getSelectedIds();
    if (wasSelected.length) {
      this.map.fire('draw.drop', {
        action: 'cancel',
        features: this.getSelected().map(f => f.toGeoJSON()),
      });
      this.clearSelectedFeatures();
      wasSelected.forEach(id => this.doRender(id));
    }
    Lib.doubleClickZoom.enable(this);
    this.stopExtendedInteractions(state);
  },

  clickOnFeature(state, e) {
    Lib.doubleClickZoom.disable(this);
    this.stopExtendedInteractions(state);

    // @ts-ignore
    const featureId = e.featureTarget?.properties?.id;
    const isFeatureSelected = this.isSelected(featureId);
    const selectedFeatureIds = this.getSelectedIds();
    const isRightClick = e.originalEvent instanceof MouseEvent ? e.originalEvent.button === 2 : true;

    if (isFeatureSelected && isRightClick) {
      this.map.fire('draw.drop', {
        action: 'confirm',
        features: this.getSelected().map(f => f.toGeoJSON()),
      });
      // @ts-ignore
      this.deselect(featureId);
      this.updateUIClasses({ mouse: Constants.cursors.POINTER });

      if (selectedFeatureIds.length === 1) {
        Lib.doubleClickZoom.enable(this);
      }
    }

    this.doRender(featureId);
  },

  onMouseDown(state, e) {
    this.onMouseDownOrTouchStart(state, e);
  },

  onTouchStart(state, e) {
    this.onMouseDownOrTouchStart(state, e);
  },

  onMouseDownOrTouchStart(state, e) {
    if (Lib.CommonSelectors.isActiveFeature(e)) return this.startOnActiveFeature(state, e);
  },

  onDrag(state, e) {
    if (state.canDragMove) return this.dragMove(state, e);
  },

  dragMove(state, e) {
    state.dragMoving = true;
    e.originalEvent.stopPropagation();

    if (!state.dragMoveLocation) {
      return;
    }

    const delta = {
      lng: e.lngLat.lng - state.dragMoveLocation.lng,
      lat: e.lngLat.lat - state.dragMoveLocation.lat
    };

    Lib.moveFeatures(this.getSelected(), delta);

    state.dragMoveLocation = e.lngLat;
  },

  onMouseUp(state, e) {
    this.onMouseUpOrTouchEnd(state, e);
  },

  onTouchEnd(state, e) {
    this.onMouseUpOrTouchEnd(state, e);
  },

  onMouseUpOrTouchEnd(state, e) {
    if (state.dragMoving) {
      this.fireUpdate();
    }

    this.stopExtendedInteractions(state);
  },

  toDisplayFeatures(state, geojson, display) {
    // @ts-ignore
    geojson.properties.active = (this.isSelected(geojson.properties.id)) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    display(geojson);
  },
};

export default SimpleDragCustomDrawMode;
