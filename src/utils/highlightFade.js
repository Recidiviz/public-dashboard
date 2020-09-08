import { color } from "d3-color";

export default function highlightFade(baseColor) {
  const fadedColor = color(baseColor);
  fadedColor.opacity = 0.3;
  return fadedColor.toString();
}
