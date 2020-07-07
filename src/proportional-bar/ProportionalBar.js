import PropTypes from "prop-types";
import React from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";

const ProportionalBarContainer = styled.figure`
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100%;
  width: 100%;
`;

const ProportionalBarMetadata = styled.figcaption`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;
const ProportionalBarTitle = styled.div`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

export default function ProportionalBar({ data, title }) {
  return (
    <ProportionalBarContainer>
      <ResponsiveOrdinalFrame
        data={data}
        margin={0}
        oAccessor={() => title}
        projection="horizontal"
        rAccessor="value"
        renderKey="label"
        responsiveHeight
        responsiveWidth
        style={(d) => ({ fill: d.color })}
        type="bar"
      />
      <ProportionalBarMetadata>
        <ProportionalBarTitle>{title}</ProportionalBarTitle>
        <ColorLegend />
      </ProportionalBarMetadata>
    </ProportionalBarContainer>
  );
}

ProportionalBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};
