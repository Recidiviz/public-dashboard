import { DIMENSION_DATA_KEYS, TOTAL_KEY } from "../constants";

export default function recordIsTotalByDimension(dimension) {
  const keysEnum = { ...DIMENSION_DATA_KEYS };
  delete keysEnum[dimension];
  const otherDataKeys = Object.values(keysEnum);
  return (record) =>
    // filter out totals
    record[DIMENSION_DATA_KEYS[dimension]] !== TOTAL_KEY &&
    // filter out subset permutations
    otherDataKeys.every((key) => record[key] === TOTAL_KEY);
}
