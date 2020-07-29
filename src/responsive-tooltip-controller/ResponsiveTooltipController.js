import useBreakpoint from "@w11r/use-breakpoint";
import empty from "empty-lite";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useInfoPanelDispatch, useInfoPanelState } from "../info-panel";
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
  render,
  setHighlighted,
}) {
  const infoPanelDispatch = useInfoPanelDispatch();
  const infoPanelState = useInfoPanelState();
  const enableInfoPanel = useBreakpoint(false, ["mobile-", true]);

  useEffect(() => {
    // when state is cleared, make sure highlight is cleared also
    if (empty(infoPanelState) && setHighlighted) {
      setHighlighted();
    }
  }, [infoPanelState, setHighlighted]);

  // if info panel becomes disabled we should clear its state
  useEffect(() => {
    if (!enableInfoPanel) {
      infoPanelDispatch({ type: "clear" });
    }
  }, [enableInfoPanel, infoPanelDispatch]);

  // childProps are props that Semiotic will recognize; non-Semiotic children
  // should implement the same API if they want to use this controller
  const tooltipContent = (d) => <Tooltip {...getTooltipProps(d)} />;
  const renderNull = () => null;

  const childProps = {
    hoverAnnotation,
    // some mobile browsers fire hover events on tap;
    // returning null prevents us from showing both tooltip and info panel simultaneously
    tooltipContent: enableInfoPanel ? renderNull : tooltipContent,
  };

  // not all chart frames support this so don't include it by default
  // or Semiotic will yell at you
  if (pieceHoverAnnotation)
    childProps.pieceHoverAnnotation = pieceHoverAnnotation;

  childProps.customClickBehavior = (d) => {
    if (enableInfoPanel) {
      infoPanelDispatch({
        type: "update",
        payload: { data: d, renderContents: tooltipContent },
      });
      if (setHighlighted) {
        setHighlighted(d);
      }
    }
  };

  childProps.customHoverBehavior = (d) => {
    if (setHighlighted) {
      setHighlighted(d);
    }
  };

  if (render) {
    return render(childProps);
  }
  if (children) {
    return (
      <>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, childProps)
        )}
      </>
    );
  }

  throw new Error("You must provide either children or a render prop");
}

ResponsiveTooltipController.propTypes = {
  children: PropTypes.node,
  getTooltipProps: PropTypes.func,
  hoverAnnotation: PropTypes.bool,
  pieceHoverAnnotation: PropTypes.bool,
  render: PropTypes.func,
  setHighlighted: PropTypes.func,
};

ResponsiveTooltipController.defaultProps = {
  children: undefined,
  getTooltipProps: chartDataToTooltipProps,
  hoverAnnotation: undefined,
  pieceHoverAnnotation: undefined,
  render: undefined,
  setHighlighted: undefined,
};
