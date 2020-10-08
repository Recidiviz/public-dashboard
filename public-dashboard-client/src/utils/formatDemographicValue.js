import {
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  DIMENSION_MAPPINGS,
} from "../constants";

export default function formatDemographicValue(val, dimensionType) {
  return dimensionType === DIMENSION_KEYS.total
    ? DIMENSION_LABELS[DIMENSION_KEYS.total]
    : DIMENSION_MAPPINGS.get(dimensionType).get(val);
}
