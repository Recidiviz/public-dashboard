import { DIMENSION_DATA_KEYS, TOTAL_KEY } from "../constants";

export default function recordIsAllRaces(record) {
  return record[DIMENSION_DATA_KEYS.race] === TOTAL_KEY;
}
