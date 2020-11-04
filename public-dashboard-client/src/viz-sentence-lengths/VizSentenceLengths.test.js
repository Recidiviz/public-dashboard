import React from "react";
import { getDataFixture, render, screen, within } from "../testUtils";
import VizSentenceLengths from ".";
import { DIMENSION_DATA_KEYS, DIMENSION_KEYS, TOTAL_KEY } from "../constants";
import { demographicsAscending } from "../utils";

const sentenceLengths = getDataFixture(
  "incarceration_lengths_by_demographics.json"
);

function getBarLabelData(record) {
  const totalReleaseCount = record.total_release_count;
  return [
    {
      label: "<1",
      pct: Math.round((100 * record.years_0_1) / totalReleaseCount),
    },
    {
      label: "1-2",
      pct: Math.round((100 * record.years_1_2) / totalReleaseCount),
    },
    {
      label: "2-3",
      pct: Math.round((100 * record.years_2_3) / totalReleaseCount),
    },
    {
      label: "3-5",
      pct: Math.round((100 * record.years_3_5) / totalReleaseCount),
    },
    {
      label: "5-10",
      pct: Math.round((100 * record.years_5_10) / totalReleaseCount),
    },
    {
      label: "10-20",
      pct: Math.round((100 * record.years_10_20) / totalReleaseCount),
    },
    {
      label: "20+",
      pct: Math.round((100 * record.years_20_plus) / totalReleaseCount),
    },
  ];
}

test("does not explode", () => {
  render(
    <VizSentenceLengths
      data={{ sentenceLengths }}
      dimension={DIMENSION_KEYS.total}
    />
  );
  expect(screen.getByText("Total")).toBeVisible();
});

test("renders a single chart for totals", () => {
  render(
    <VizSentenceLengths
      data={{ sentenceLengths }}
      dimension={DIMENSION_KEYS.total}
    />
  );
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizEl = screen.getByLabelText("7 bars in a bar chart");
  expect(vizEl).toBeVisible();
  // inspect the figure to determine what values the chart should reflect
  const totalRecord = sentenceLengths.find(
    // eslint-disable-next-line camelcase
    ({ gender, age_bucket, race_or_ethnicity }) =>
      // eslint-disable-next-line camelcase
      gender === "ALL" && age_bucket === "ALL" && race_or_ethnicity === "ALL"
  );

  // y axis as percentages
  expect(screen.getByLabelText("left axis from 0% to 100%")).toBeVisible();

  getBarLabelData(totalRecord).forEach((expectedValue, index) => {
    // this is the actual mark, which is very helpfully labeled
    expect(
      within(vizEl).getByRole("img", {
        name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
      })
    );

    let barTickLabel = expectedValue.label;
    // the first one is a special case
    if (index === 0) {
      barTickLabel += " year";
    }
    expect(screen.getByText(barTickLabel)).toBeVisible();
  });
});

test("renders one chart per race subgroup", () => {
  render(
    <VizSentenceLengths
      data={{ sentenceLengths }}
      dimension={DIMENSION_KEYS.race}
    />
  );
  const raceRecords = sentenceLengths
    .filter((record) => record[DIMENSION_DATA_KEYS.race] !== TOTAL_KEY)
    // we expect this sort order to be the document order as well
    .sort((a, b) =>
      demographicsAscending(
        a[DIMENSION_DATA_KEYS.race],
        b[DIMENSION_DATA_KEYS.race]
      )
    );
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("7 bars in a bar chart");
  expect(vizElList.length).toBe(raceRecords.length);

  raceRecords.forEach((record, index) => {
    getBarLabelData(record).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});

test("renders one chart per gender subgroup", () => {
  render(
    <VizSentenceLengths
      data={{ sentenceLengths }}
      dimension={DIMENSION_KEYS.gender}
    />
  );
  const genderRecords = sentenceLengths
    .filter((record) => record[DIMENSION_DATA_KEYS.gender] !== TOTAL_KEY)
    // we expect this sort order to be the document order as well
    .sort((a, b) =>
      demographicsAscending(
        a[DIMENSION_DATA_KEYS.gender],
        b[DIMENSION_DATA_KEYS.gender]
      )
    );
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("7 bars in a bar chart");
  expect(vizElList.length).toBe(genderRecords.length);

  genderRecords.forEach((record, index) => {
    getBarLabelData(record).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});

test("renders one chart per age subgroup", () => {
  render(
    <VizSentenceLengths
      data={{ sentenceLengths }}
      dimension={DIMENSION_KEYS.age}
    />
  );
  const ageRecords = sentenceLengths
    .filter((record) => record[DIMENSION_DATA_KEYS.age] !== TOTAL_KEY)
    // we expect this sort order to be the document order as well
    .sort((a, b) =>
      demographicsAscending(
        a[DIMENSION_DATA_KEYS.age],
        b[DIMENSION_DATA_KEYS.age]
      )
    );
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("7 bars in a bar chart");
  expect(vizElList.length).toBe(ageRecords.length);

  ageRecords.forEach((record, index) => {
    getBarLabelData(record).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});
