import { ascending } from "d3-array";
import { exact, head, tail } from "set-order";
import { AGE_KEYS, OTHER, DEMOGRAPHIC_UNKNOWN } from "../constants";

// demographic values have various special values that should be sorted
// non-alphabetically for display
const sortFn = exact(
  [head(AGE_KEYS.under25), tail(OTHER), tail(DEMOGRAPHIC_UNKNOWN)],
  ascending
);

export default function demographicsAscending(a, b) {
  return sortFn(a, b);
}
