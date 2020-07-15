import { DIMENSION_MAPPINGS } from "../constants";

export default function formatDemographicValue(val, dimensionType) {
  return DIMENSION_MAPPINGS.get(dimensionType).get(val);
}
