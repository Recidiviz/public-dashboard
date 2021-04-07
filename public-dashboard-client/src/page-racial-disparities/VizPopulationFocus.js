import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { RACE_LABELS } from "../constants";
import ProportionalBar from "../proportional-bar";
import { recordIsAllRaces } from "../utils";
import {
  BreakdownWrapper,
  getCorrectionsPopulationCurrent,
  matchRace,
  useBarHeight,
} from "./helpers";
import { THEME } from "../theme";

const Wrapper = styled.div``;

export default function VizPopulationFocus({
  data: { category, countsByRace },
}) {
  const recordForCategory = countsByRace.find(matchRace(category));
  const recordForTotals = countsByRace.find(recordIsAllRaces);

  const categoryColor = THEME.colors.racialDisparities.selected;
  const otherColor = THEME.colors.racialDisparities.remainder;

  const totalPopulationData = [
    {
      color: categoryColor,
      label: RACE_LABELS.get(category),
      value: recordForCategory.total_state_population,
    },
    {
      color: otherColor,
      label: "All other racial/ethnic groups",
      value:
        recordForTotals.total_state_population -
        recordForCategory.total_state_population,
    },
  ];

  const correctionsPopulationData = [
    {
      color: categoryColor,
      label: RACE_LABELS.get(category),
      value: getCorrectionsPopulationCurrent(recordForCategory),
    },
    {
      color: otherColor,
      label: "All other racial/ethnic groups",
      value:
        getCorrectionsPopulationCurrent(recordForTotals) -
        getCorrectionsPopulationCurrent(recordForCategory),
    },
  ];

  const barHeight = useBarHeight();
  const [highlighted, setHighlighted] = useState();

  return (
    <Wrapper>
      <BreakdownWrapper stackOrder={1}>
        <ProportionalBar
          data={totalPopulationData}
          height={barHeight}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          title="Proportions of total state population"
          showLegend={false}
        />
      </BreakdownWrapper>
      <BreakdownWrapper stackOrder={0}>
        <ProportionalBar
          data={correctionsPopulationData}
          height={barHeight}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          title="Proportions of people sentenced and under DOCR control"
          showLegend
        />
      </BreakdownWrapper>
    </Wrapper>
  );
}

VizPopulationFocus.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.string.isRequired,
    countsByRace: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
