import { advanceTo, clear } from "jest-date-mock";
import addEmptyMonthsToData from "./addEmptyMonthsToData";

describe("function", () => {
  // mocking Date because this function always operates relative to the current day
  const mockToday = new Date(2020, 2, 15);
  beforeEach(() => {
    advanceTo(mockToday);
  });
  afterEach(() => clear());

  test("patches missing records with proper year and month", () => {
    // note that data are not in chronological order; it shouldn't matter
    const missingRecords = [
      {
        year: "2020",
        month: "2",
        test_metric: "0",
      },
      {
        year: "2019",
        month: "11",
        test_metric: "0",
      },
    ];
    const dataWithGaps = [
      {
        year: "2020",
        month: "1",
        test_metric: "3",
      },
      {
        year: "2019",
        month: "12",
        test_metric: "5",
      },
      {
        year: "2020",
        month: "3",
        test_metric: "8",
      },
    ];

    const patchedData = addEmptyMonthsToData({
      dataPoints: dataWithGaps,
      monthCount: 5,
      valueKey: "test_metric",
      emptyValue: "0",
    });

    const expectedData = [...dataWithGaps, ...missingRecords];

    // complete but not sorted!
    expect(patchedData).toEqual(expect.arrayContaining(expectedData));
    // no extraneous items
    expect(patchedData.length).toEqual(expectedData.length);
  });

  test("patches data with missing exact dates", () => {
    // note that data are not in chronological order; it shouldn't matter
    const missingRecords = [
      {
        metric_date: "2020-02-01",
        test_metric: "0",
      },
      {
        metric_date: "2019-11-01",
        test_metric: "0",
      },
    ];
    const dataWithGaps = [
      {
        metric_date: "2020-01-01",
        test_metric: "3",
      },
      {
        metric_date: "2019-12-01",
        test_metric: "5",
      },
      {
        metric_date: "2020-03-01",
        test_metric: "8",
      },
    ];

    const patchedData = addEmptyMonthsToData({
      dataPoints: dataWithGaps,
      monthCount: 5,
      valueKey: "test_metric",
      emptyValue: "0",
      dateField: "metric_date",
    });

    const expectedData = [...dataWithGaps, ...missingRecords];

    // complete but not sorted!
    expect(patchedData).toEqual(expect.arrayContaining(expectedData));
    // no extraneous items
    expect(patchedData.length).toEqual(expectedData.length);
  });

  test("includes extra fields in patched records", () => {
    const extraFields = {
      important_extra_field: "blerg",
      additional_important_extra_field: "also blerg",
    };
    const dataWithGaps = [
      {
        year: "2020",
        month: "3",
        test_metric: "8",
        ...extraFields,
      },
    ];

    const patchedData = addEmptyMonthsToData({
      dataPoints: dataWithGaps,
      monthCount: 5,
      valueKey: "test_metric",
      emptyValue: "0",
      extraFields,
    });

    expect(patchedData.length).toEqual(5);
    patchedData.forEach((record) => {
      expect(record).toEqual(expect.objectContaining(extraFields));
    });
  });
});
