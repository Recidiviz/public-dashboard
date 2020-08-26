import { mediaQuery } from "@w11r/use-breakpoint";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { COLLAPSIBLE_NAV_BREAKPOINT } from "../constants";

const SMALL_DATA = (
  <>
    * Please always take note of the number of people associated with each
    proportion presented here; in cases where the counts are especially low, the
    proportion may not be statistically significant and therefore are not
    indicative of long-term trends.
  </>
);

const DisclaimerWrapper = styled.div`
  font-size: 13px;
  margin-top: 24px;
  max-width: ${(props) => props.theme.sectionTextWidth};

  ${mediaQuery([COLLAPSIBLE_NAV_BREAKPOINT, `max-width: none;`])};
`;

export default function Disclaimer({ type }) {
  return (
    <DisclaimerWrapper>{type === "small-data" && SMALL_DATA}</DisclaimerWrapper>
  );
}

Disclaimer.propTypes = {
  type: PropTypes.oneOf(["small-data"]).isRequired,
};
