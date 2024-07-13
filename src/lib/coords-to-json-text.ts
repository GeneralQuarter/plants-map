export function coordsToJSONtext(coords: [number, number][]) {
  return `[\n${coords.reduce((acc, c, i, a) => acc += `    [${c.join(', ')}]${i !== a.length - 1 ? ',\n' : ''}`, '')}\n]`
}
