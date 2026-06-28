export const MRFOX_APP_DOWNLOAD_URL = "https://link.mrfox.app/";

export function resolveStoreDownloadUrl(type: string, url: string): string {
  if (type === "ios" || type === "android") {
    return MRFOX_APP_DOWNLOAD_URL;
  }
  return url;
}
