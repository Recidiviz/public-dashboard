import { title } from "case";

const CUSTOM_DEMOGRAPHIC_VALUES = {
  EXTERNAL_UNKNOWN: "Unknown",
};

const NUMBER_RANGE_PATTERN = /<?\d+(-\d+|<)?/;

export default function formatDemographicValue(val) {
  return (
    CUSTOM_DEMOGRAPHIC_VALUES[val] ||
    (NUMBER_RANGE_PATTERN.test(val) ? val : title(val))
  );
}
