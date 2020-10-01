import { subMonths, eachMonthOfInterval } from "date-fns";

const getMonthParts = (date) => {
  const year = date.getFullYear();
  // months are 1-indexed in our data source
  const month = date.getMonth() + 1;

  return { year, month };
};

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
  includeCurrentMonth,
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

  const isMonthMissing = ({ year, month }) => {
    return !representedMonths[year] || !representedMonths[year][month];
  };

  const newDataPoints = [...dataPoints];

  let end = new Date();

  if (!includeCurrentMonth) {
    // there may be a reporting lag for the current month; if it's missing,
    // instead of patching it we should just shift the entire window back one month
    if (isMonthMissing(getMonthParts(end))) {
      end = subMonths(end, 1);
    }
  }

  const start = subMonths(end, monthCount - 1);
  eachMonthOfInterval({ start, end }).forEach((monthDate) => {
    const { year, month } = getMonthParts(monthDate);
    if (isMonthMissing({ year, month })) {
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
