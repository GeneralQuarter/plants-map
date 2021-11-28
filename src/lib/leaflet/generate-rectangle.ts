export function generateRectangle(startPoint: [number, number], width: number, length: number) {
  const topRight = destination(startPoint, 90, length);
  const bottomRight = destination(topRight, 180, width);
  const bottomLeft = destination(bottomRight, 270, length);

  return [startPoint, topRight, bottomRight, bottomLeft, startPoint];
}

// Leaflet.GeometryUtil destination
function destination(latLng: [number, number], heading: number, distance: number): [number, number] {
  const nHeading = (heading + 360) % 360;
  const rad = Math.PI / 180;
  const radInv = 180 / Math.PI;
  const R = 6378137; // approximation of Earth's radius
  const lon1 = latLng[1] * rad;
  const lat1 = latLng[0] * rad;
  const rheading = nHeading * rad;
  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const cosDistR = Math.cos(distance / R);
  const sinDistR = Math.sin(distance / R);
  const lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading));
  let lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR *
          cosLat1, cosDistR - sinLat1 * Math.sin(lat2));
  lon2 = lon2 * radInv;
  lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
  return [lat2 * radInv, lon2];
}