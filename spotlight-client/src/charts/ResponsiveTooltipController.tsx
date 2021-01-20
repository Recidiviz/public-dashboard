// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import useBreakpoint from "@w11r/use-breakpoint";
import isEmpty from "lodash.isempty";
import React, { useEffect, useState } from "react";
import { AnnotationType } from "semiotic/lib/types/annotationTypes";
import {
  TooltipContentProps,
  useInfoPanelDispatch,
  useInfoPanelState,
} from "../InfoPanel";
import Tooltip, { TooltipProps } from "../Tooltip";
import { ItemToHighlight } from "./types";

function chartDataToTooltipProps({ label, value, pct }: TooltipContentProps) {
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

type SemioticChildProps = Record<string, unknown>;

export type ResponsiveTooltipControllerProps = {
  customHoverBehavior?: (record: TooltipContentProps) => void;
  getTooltipProps?: (record: TooltipContentProps) => TooltipProps;
  hoverAnnotation?: boolean | AnnotationType[];
  pieceHoverAnnotation?: boolean;
  render: (props: SemioticChildProps) => React.ReactElement;
  setHighlighted?: (item?: ItemToHighlight) => void;
};

/**
 * a wrapper around visualization components that passes props
 * as needed for native hover annotations in Semiotic but also
 * uses same configuration to power our custom InfoPanel component
 * (which is for touch screens, which Semiotic does not natively support
 * for hover-equivalent interactions)
 */
const ResponsiveTooltipController: React.FC<ResponsiveTooltipControllerProps> = ({
  children,
  getTooltipProps = chartDataToTooltipProps,
  hoverAnnotation,
  pieceHoverAnnotation,
  render,
  setHighlighted,
  customHoverBehavior,
}) => {
  const infoPanelDispatch = useInfoPanelDispatch();
  const infoPanelState = useInfoPanelState();
  const enableInfoPanel = useBreakpoint(false, ["mobile-", true]);
  const [clickAnnotations, setClickAnnotations] = useState<AnnotationType[]>();

  useEffect(() => {
    // when state is cleared, make sure any relevant chart props are cleared also
    if (isEmpty(infoPanelState)) {
      if (setHighlighted) setHighlighted();
      setClickAnnotations(undefined);
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
  const tooltipContent = (d: TooltipContentProps) => (
    <Tooltip {...getTooltipProps(d)} />
  );
  const renderNull = () => null;

  const childProps: SemioticChildProps = {
    hoverAnnotation,
    // some mobile browsers fire hover events on tap;
    // returning null prevents us from showing both tooltip and info panel simultaneously
    tooltipContent: enableInfoPanel ? renderNull : tooltipContent,
  };

  if (clickAnnotations) {
    // there is no such thing as a "click annotation" in Semiotic
    // so we just pass them as regular annotations
    childProps.annotations = clickAnnotations;
  }

  // not all chart frames support this so don't include it by default
  // or Semiotic will yell at you
  if (pieceHoverAnnotation)
    childProps.pieceHoverAnnotation = pieceHoverAnnotation;

  childProps.customClickBehavior = (d: TooltipContentProps) => {
    if (enableInfoPanel) {
      infoPanelDispatch({
        type: "update",
        payload: { data: d, renderContents: tooltipContent },
      });
      if (setHighlighted) {
        setHighlighted(d);
      }
      if (Array.isArray(hoverAnnotation)) {
        // if there is hover behavior other than the tooltip, we want to preserve it
        const additionalHoverAnnotations: AnnotationType[] = hoverAnnotation
          .filter(({ type }) => type !== "frame-hover")
          .map((annotationSpec) => {
            // hover annotation specs expect to have point data applied on the fly;
            // here we will substitute equivalent data from the click event
            return { ...annotationSpec, ...d.data };
          });

        if (additionalHoverAnnotations.length) {
          setClickAnnotations(additionalHoverAnnotations);
        }
      }
    }
  };

  childProps.customHoverBehavior = (d: TooltipContentProps) => {
    if (setHighlighted) {
      setHighlighted(d);
    }
    if (customHoverBehavior) customHoverBehavior(d);
  };

  if (render) {
    return render(childProps);
  }
  if (children) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child))
            return React.cloneElement(child, childProps);
        })}
      </>
    );
  }

  throw new Error("You must provide either children or a render prop");
};

export default ResponsiveTooltipController;
