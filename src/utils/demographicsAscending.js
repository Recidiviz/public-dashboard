import { ascending } from "d3-array";
import { exact, head, tail } from "set-order";

// demographic values have various special values that should be sorted
// non-alphabetically for display
const sortFn = exact(
  [head("<25"), tail("OTHER"), tail("EXTERNAL_UNKNOWN")],
  ascending
);

export default function demographicsAscending(a, b) {
  return sortFn(a, b);
}
