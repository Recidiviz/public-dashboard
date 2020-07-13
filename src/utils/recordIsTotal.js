import { DIMENSION_DATA_KEYS, TOTAL_KEY } from "../constants";

export default function recordIsTotal(record) {
  return (
    record[DIMENSION_DATA_KEYS.race] === TOTAL_KEY &&
    record[DIMENSION_DATA_KEYS.gender] === TOTAL_KEY &&
    record[DIMENSION_DATA_KEYS.age] === TOTAL_KEY
  );
}
