import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

// implements a version of the Aspect Ratio Box technique described here:
// https://github.com/zcreativelabs/react-simple-maps/issues/37#issuecomment-349435145
// but with explicit width (our flex layout prefers it or elements may collapse)
const RatioContainerOuter = styled.div`
  position: relative;
  height: 0;
  padding-bottom: calc(${(props) => props.aspectRatio} * 100%);
  width: ${(props) => props.width}px;
`;

const RatioContainerInner = styled.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export default function AspectRatioWrapper({ aspectRatio, children, width }) {
  return (
    <RatioContainerOuter width={width} aspectRatio={aspectRatio}>
      <RatioContainerInner>{children}</RatioContainerInner>
    </RatioContainerOuter>
  );
}

AspectRatioWrapper.propTypes = {
  aspectRatio: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
};
