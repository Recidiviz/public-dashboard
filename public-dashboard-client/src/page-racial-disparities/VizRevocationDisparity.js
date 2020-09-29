import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { TOTAL_KEY, VIOLATION_LABELS } from "../constants";
import Disclaimer from "../disclaimer";
import ProportionalBar from "../proportional-bar";
import {
  BreakdownWrapper,
  DynamicText,
  getSupervisionCounts36Mo,
  matchRace,
  useBarHeight,
} from "./helpers";
import { THEME } from "../theme";

const Wrapper = styled.div``;

export default function VizRevocationDisparity({
  data: { countsByRace, category, ethnonym, supervisionType },
}) {
  const totals = getSupervisionCounts36Mo(
    countsByRace.find(matchRace(TOTAL_KEY))
  );
  const selected = getSupervisionCounts36Mo(
    countsByRace.find(matchRace(category))
  );

  const [totalData, categoryData] = [totals, selected].map(
    (supervisionData) => {
      const dataForSupervisionType = supervisionData[supervisionType];
      return Object.entries(VIOLATION_LABELS)
        .map(([key, label]) => {
          return {
            color: THEME.colors.violationReasons[key],
            label,
            value: dataForSupervisionType[key],
          };
        })
        .sort((a, b) => ascending(a.label, b.label));
    }
  );

  const barHeight = useBarHeight();
  const [highlighted, setHighlighted] = useState();

  return (
    <Wrapper>
      <BreakdownWrapper stackOrder={1}>
        <ProportionalBar
          data={totalData}
          height={barHeight}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          title="Proportions of revocation reasons overall"
          showLegend={false}
        />
      </BreakdownWrapper>
      <BreakdownWrapper stackOrder={0}>
        <ProportionalBar
          data={categoryData}
          height={barHeight}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          title={
            <>
              Proportions of revocation reasons for{" "}
              <DynamicText>{ethnonym}</DynamicText>
            </>
          }
          showLegend
        />
      </BreakdownWrapper>
      <Disclaimer type="small-data" />
    </Wrapper>
  );
}

VizRevocationDisparity.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.string.isRequired,
    countsByRace: PropTypes.arrayOf(PropTypes.object).isRequired,
    ethnonym: PropTypes.string.isRequired,
    supervisionType: PropTypes.string.isRequired,
  }).isRequired,
};
