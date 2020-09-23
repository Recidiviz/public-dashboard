import { subMonths, eachMonthOfInterval } from "date-fns";

/**
 * Returns a new list of data points consisting of the given data points and new
 * data points appended for any month in the last `monthCount` number of months
 * that is missing data, where the value for the `valueKey` property is `emptyValue`.
 * If `dateField` is passed, all values of that key should be Date objects.
 * Originally adapted from pulse-dashboard.
 */
export default function addEmptyMonthsToData({
  dataPoints,
  monthCount,
  valueKey,
  emptyValue,
  dateField,
}) {
  // dateSource must be an array of {year: number, month: number (1-indexed)}
  let dateSource = dataPoints;

  // if we have been given a date field, extract year and month from it
  if (dateField) {
    dateSource = dataPoints.map((record) => {
      const dateString = record[dateField];
      const [year, month] = dateString.split("-").map(Number);
      return { year, month };
    });
  }

  const representedMonths = {};
  dateSource.forEach(({ year, month }) => {
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
      const monthData = {};

      // if we read from date field, write to date field
      if (dateField) {
        monthData[dateField] = `${year}-${`${month}`.padStart(2, "0")}-01`;
      } else {
        Object.assign(monthData, {
          year: year.toString(),
          month: month.toString(),
        });
      }
      monthData[valueKey] = emptyValue;
      newDataPoints.push(monthData);
    }
  });

  return newDataPoints;
}
