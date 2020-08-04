import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { THEME, TOTAL_KEY, VIOLATION_LABELS } from "../constants";
import ProportionalBar from "../proportional-bar";
import {
  DynamicText,
  getSupervisionCounts36Mo,
  matchRace,
  useBarHeight,
} from "./helpers";

const Wrapper = styled.div``;

const BreakdownWrapper = styled.div`
  padding-bottom: 16px;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + props.stackOrder};
`;

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

  return (
    <Wrapper>
      <BreakdownWrapper stackOrder={1}>
        <ProportionalBar
          data={totalData}
          height={barHeight}
          title="Proportions of revocation reasons overall"
          showLegend={false}
        />
      </BreakdownWrapper>
      <BreakdownWrapper stackOrder={0}>
        <ProportionalBar
          data={categoryData}
          height={barHeight}
          title={
            <>
              Proportions of revocation reasons for{" "}
              <DynamicText>{ethnonym}</DynamicText>
            </>
          }
          showLegend
        />
      </BreakdownWrapper>
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
