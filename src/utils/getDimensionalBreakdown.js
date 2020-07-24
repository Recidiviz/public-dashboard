import {
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  DIMENSION_MAPPINGS,
} from "../constants";
import categoryIsNotUnknown from "./categoryIsNotUnknown";
import recordIsTotal from "./recordIsTotal";
import recordIsTotalByDimension from "./recordIsTotalByDimension";

export default function getDimensionalBreakdown({ data, dimension }) {
  const categories = DIMENSION_MAPPINGS.get(dimension);
  const filteredData = data
    ? data.filter(recordIsTotalByDimension(dimension))
    : null;
  return [...categories].filter(categoryIsNotUnknown).map(([value, label]) => {
    return {
      id: value,
      label,
      record:
        filteredData &&
        filteredData.find((record) =>
          dimension === DIMENSION_KEYS.total
            ? recordIsTotal(record)
            : record[DIMENSION_DATA_KEYS[dimension]] === value
        ),
    };
  });
}
