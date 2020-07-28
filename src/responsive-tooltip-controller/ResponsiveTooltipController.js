import PropTypes from "prop-types";
import React from "react";
import { useInfoPanelDispatch } from "../info-panel";
import Tooltip from "../tooltip";

function chartDataToTooltipProps({ label, value, pct }) {
  return {
    title: label,
    records: [
      {
        value,
        pct,
      },
    ],
  };
}

// a wrapper around visualization components that passes props
// as needed for native hover annotations in Semiotic but also
// uses same configuration to power our custom InfoPanel component
// (which is for touch screens, which Semiotic does not natively support
// for hover-equivalent interactions)
export default function ResponsiveTooltipController({
  children,
  getTooltipProps,
  hoverAnnotation,
  pieceHoverAnnotation,
}) {
  const infoPanelDispatch = useInfoPanelDispatch();

  // childProps are props that Semiotic will recognize; non-Semiotic children
  // should implement the same API if they want to use this controller
  const tooltipContent = (d) => <Tooltip {...getTooltipProps(d)} />;
  const childProps = { hoverAnnotation, pieceHoverAnnotation, tooltipContent };

  childProps.customClickBehavior = (d) =>
    infoPanelDispatch({
      type: "update",
      payload: { data: d, renderContents: tooltipContent },
    });

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, childProps)
      )}
    </>
  );
}

ResponsiveTooltipController.propTypes = {
  children: PropTypes.node.isRequired,
  getTooltipProps: PropTypes.func,
  hoverAnnotation: PropTypes.bool,
  pieceHoverAnnotation: PropTypes.bool,
};

ResponsiveTooltipController.defaultProps = {
  getTooltipProps: chartDataToTooltipProps,
  hoverAnnotation: undefined,
  pieceHoverAnnotation: undefined,
};
