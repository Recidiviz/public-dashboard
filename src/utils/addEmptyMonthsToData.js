import { subMonths, eachMonthOfInterval } from "date-fns";
/**
 * Returns a new list of data points consisting of the given data points and new
 * data points appended for any month in the last `monthCount` number of months
 * that is missing data, where the value for the `valueKey` property is `emptyValue`.
 * NOTE: copied and lightly adapted from pulse-dashboard
 */
export default function addEmptyMonthsToData({
  dataPoints,
  monthCount,
  valueKey,
  emptyValue,
}) {
  const representedMonths = {};
  dataPoints.forEach(({ year, month }) => {
    if (!representedMonths[year]) {
      representedMonths[year] = {};
    }
    representedMonths[year][month] = true;
  });

  const newDataPoints = [...dataPoints];

  const end = new Date();
  const start = subMonths(end, monthCount - 1);
  eachMonthOfInterval({ start, end }).forEach((monthDate) => {
    const year = monthDate.getFullYear();
    // months are 1-indexed in our data source
    const month = monthDate.getMonth() + 1;
    if (!representedMonths[year] || !representedMonths[year][month]) {
      const monthData = {
        year: year.toString(),
        month: month.toString(),
      };
      monthData[valueKey] = emptyValue;
      newDataPoints.push(monthData);
    }
  });

  return newDataPoints;
}
