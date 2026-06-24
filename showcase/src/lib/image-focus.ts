export const DEFAULT_IMAGE_FOCUS = "50% 50%";

export function parseImageFocus(value?: string | null) {
  const css = value?.trim() || DEFAULT_IMAGE_FOCUS;
  const match = css.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);

  if (!match) {
    return { x: 50, y: 50, css: DEFAULT_IMAGE_FOCUS };
  }

  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    css,
  };
}

export function formatImageFocus(x: number, y: number) {
  const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)));
  return `${clamp(x)}% ${clamp(y)}%`;
}
