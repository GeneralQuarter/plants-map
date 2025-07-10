// https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
export function metersPerPixel(lat: number, zoom: number) {
  return (
    (40075016.686 * Math.abs(Math.cos((lat * Math.PI) / 180))) / 2 ** (zoom + 8)
  );
}
