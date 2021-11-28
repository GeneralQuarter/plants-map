export function hostNameFromUrl(urlStr: string) {
  const {hostname} = new URL(urlStr);
  return hostname;
}