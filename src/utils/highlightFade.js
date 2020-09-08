import { color as d3Color } from "d3-color";

export default function highlightFade(color) {
  const fadedColor = d3Color(color);
  fadedColor.opacity = 0.3;
  return fadedColor.toString();
}
