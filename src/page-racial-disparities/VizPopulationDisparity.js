import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import {
  DIMENSION_DATA_KEYS,
  RACE_LABELS,
  THEME,
  TOTAL_KEY,
} from "../constants";
import ProportionalBar from "../proportional-bar";
import { demographicsAscending } from "../utils";
import { getCorrectionsPopulation } from "./helpers";

const Wrapper = styled.div``;

const BreakdownWrapper = styled.div`
  padding-bottom: 16px;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + props.stackOrder};
`;

const BAR_HEIGHT = 180;

const notTotal = (record) => record[DIMENSION_DATA_KEYS.race] !== TOTAL_KEY;
const sortByRace = (a, b) =>
  demographicsAscending(
    a[DIMENSION_DATA_KEYS.race],
    b[DIMENSION_DATA_KEYS.race]
  );

export default function VizPopulationDisparity({
  data: { countsByRace, category },
}) {
  const filteredData = countsByRace.filter(notTotal).sort(sortByRace);

  const totalPopulationData = filteredData.map((record) => {
    const raceValue = record[DIMENSION_DATA_KEYS.race];
    return {
      color:
        raceValue === category
          ? THEME.colors.highlight
          : THEME.colors.race[raceValue],
      label: RACE_LABELS.get(raceValue),
      value: record.total_state_population,
    };
  });

  const correctionsPopulationData = filteredData.map((record) => {
    const raceValue = record[DIMENSION_DATA_KEYS.race];
    return {
      color:
        raceValue === category
          ? THEME.colors.highlight
          : THEME.colors.race[raceValue],
      label: RACE_LABELS.get(raceValue),
      value: getCorrectionsPopulation(record),
    };
  });

  return (
    <Wrapper>
      <BreakdownWrapper stackOrder={0}>
        <ProportionalBar
          data={totalPopulationData}
          height={BAR_HEIGHT}
          title="Proportions of races in the state"
          showLegend={false}
        />
      </BreakdownWrapper>
      <BreakdownWrapper stackOrder={1}>
        <ProportionalBar
          data={correctionsPopulationData}
          height={BAR_HEIGHT}
          title="Proportions of races sentenced and under DOCR control"
          showLegend
        />
      </BreakdownWrapper>
    </Wrapper>
  );
}

VizPopulationDisparity.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.string.isRequired,
    countsByRace: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
