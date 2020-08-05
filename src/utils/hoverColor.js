import { hsl } from "d3-color";

export default function hoverColor(color) {
  return hsl(color).darker(0.5).hex();
}
