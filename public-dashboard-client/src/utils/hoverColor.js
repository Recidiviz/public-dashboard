import { hsl } from "d3-color";

// FYI these don't have to be exactly equal for any mathematical reason,
// the values just resulted from eyeballing the perceptual effect
const SATURATION_ADJUST = 0.11;
const LIGHTNESS_ADJUST = 0.11;

export default function hoverColor(color) {
  const { h, s, l, opacity } = hsl(color);
  // by adjusting both lightness and saturation, we darken without getting muddy
  return hsl(
    h,
    s + SATURATION_ADJUST,
    l - LIGHTNESS_ADJUST,
    opacity
  ).toString();
}
