export const MRFOX_APP_DOWNLOAD_URL = "https://link.mrfox.app/";

export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.mrfox.app";

export function resolveStoreDownloadUrl(type: string, url: string): string {
  if (type === "ios") {
    return MRFOX_APP_DOWNLOAD_URL;
  }
  if (type === "android") {
    return GOOGLE_PLAY_URL;
  }
  return url;
}
