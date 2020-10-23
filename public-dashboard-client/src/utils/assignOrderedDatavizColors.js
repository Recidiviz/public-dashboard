import { THEME } from "../theme";

const DATAVIZ_COLORS = THEME.colors.dataViz;

export default function assignOrderedDatavizColors(list) {
  return list.map((record, i) => {
    return { ...record, color: DATAVIZ_COLORS[i % DATAVIZ_COLORS.length] };
  });
}
