// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BarChartTrellis from "../bar-chart-trellis";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
  TOTAL_KEY,
} from "../constants";
import { THEME } from "../theme";
import { demographicsAscending, recordIsTotalByDimension } from "../utils";

const Wrapper = styled.div``;

/**
 * Returns one data series per demographic subgroup, containing all records
 * for the specified followup period
 */
function prepareData({ recidivismRates, followupYears, dimension }) {
  const dataForFollowupYears = recidivismRates
    .filter((record) => record.followupYears === followupYears)
    .filter(recordIsTotalByDimension(dimension))
    .sort((a, b) =>
      demographicsAscending(
        a[DIMENSION_DATA_KEYS[dimension]],
        b[DIMENSION_DATA_KEYS[dimension]]
      )
    );

  return Array.from(
    group(
      dataForFollowupYears,
      (record) => record[DIMENSION_DATA_KEYS[dimension]] || TOTAL_KEY
    ),
    ([subgroupId, records]) => {
      return {
        title: DIMENSION_MAPPINGS.get(dimension).get(subgroupId),
        data: records.map((record) => ({
          color: THEME.colors.recidivismSingleFollowup,
          label: record.releaseCohort,
          value: record.recidivismRate,
          pct: record.recidivismRate,
          // raw values for displaying in the tooltip; chart doesn't use them
          recidivatedReleases: record.recidivated_releases,
          totalReleases: record.releases,
        })),
      };
    }
  );
}

export default function VizRecidivismSingleFollowup({ data, dimension }) {
  const [selectedChartTitle, setSelectedChartTitle] = useState();

  if (!dimension) return null;

  const renderTooltip = (columnData) => {
    const {
      summary: [d],
    } = columnData;
    return {
      title: selectedChartTitle || "",
      records: [
        {
          label: d.data.label,
          value: `${d.data.recidivatedReleases} of ${d.data.totalReleases}`,
          pct: d.data.pct,
        },
      ],
    };
  };

  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <Wrapper ref={measureRef}>
          <BarChartTrellis
            barAxisLabel="Release cohort"
            data={prepareData({ dimension, ...data })}
            renderTooltip={renderTooltip}
            setSelectedChartTitle={setSelectedChartTitle}
            width={width || 0}
          />
        </Wrapper>
      )}
    </Measure>
  );
}

VizRecidivismSingleFollowup.propTypes = {
  data: PropTypes.shape({
    followupYears: PropTypes.number.isRequired,
    recidivismRates: PropTypes.arrayOf(
      PropTypes.shape({
        followupYears: PropTypes.number.isRequired,
        recidivismRate: PropTypes.number.isRequired,
        releaseCohort: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
};

VizRecidivismSingleFollowup.defaultProps = {
  dimension: undefined,
};
