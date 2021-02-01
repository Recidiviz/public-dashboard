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
import { action, autorun } from "mobx";
import React, { useEffect, useState } from "react";
import { AnnotationType } from "semiotic/lib/types/annotationTypes";
import { OrdinalFrameProps } from "semiotic/lib/types/ordinalTypes";
import { XYFrameProps } from "semiotic/lib/types/xyTypes";
import Tooltip, { TooltipContentProps } from "../Tooltip";
import { ItemToHighlight, ProjectedDataPoint } from "./types";
import { useDataStore } from "../StoreProvider";

/**
 * Default tooltip content generator. Provides a title and a single
 * data point with optional percentage. Good enough for most charts.
 */
function chartDataToTooltipProps({
  label,
  value,
  pct,
}: ProjectedDataPoint): TooltipContentProps {
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

// in practice it should be one or the other but it's not straightforward
// to discriminate them at compile time
type SemioticChildProps = Partial<XYFrameProps> & Partial<OrdinalFrameProps>;

export type ResponsiveTooltipControllerProps = {
  customHoverBehavior?: (record?: ProjectedDataPoint) => void;
  getTooltipProps?: (point: ProjectedDataPoint) => TooltipContentProps;
  hoverAnnotation?:
    | XYFrameProps["hoverAnnotation"]
    | OrdinalFrameProps["hoverAnnotation"];
  pieceHoverAnnotation?: boolean;
  render?: (props: SemioticChildProps) => React.ReactElement;
  setHighlighted?: (item?: ItemToHighlight) => void;
};

/**
 * a wrapper around visualization components that passes props
 * as needed for native hover annotations in Semiotic but also
 * uses same configuration to power our custom TooltipMobile component
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
  const { uiStore } = useDataStore();
  const enableTouchTooltip = useBreakpoint(false, ["mobile-", true]);
  const [clickAnnotations, setClickAnnotations] = useState<AnnotationType[]>();

  useEffect(
    () =>
      autorun(() => {
        // when state is cleared, make sure any relevant chart props are cleared also
        if (isEmpty(uiStore.tooltipMobileData)) {
          if (setHighlighted) setHighlighted();
          setClickAnnotations(undefined);
        }
      }),
    [setHighlighted, uiStore]
  );

  // if info panel becomes disabled we should clear its state
  useEffect(() => {
    if (!enableTouchTooltip) {
      uiStore.clearTooltipMobile();
    }
  }, [enableTouchTooltip, uiStore]);

  // childProps are props that Semiotic will recognize; non-Semiotic children
  // should implement the same API if they want to use this controller
  const tooltipContent = (d: ProjectedDataPoint) => (
    <Tooltip {...getTooltipProps(d)} />
  );
  const renderNull = () => null;

  const childProps: SemioticChildProps = {
    hoverAnnotation,
    // some mobile browsers fire hover events on tap;
    // returning null prevents us from showing both tooltip and info panel simultaneously
    tooltipContent: enableTouchTooltip ? renderNull : tooltipContent,
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

  childProps.customClickBehavior = (d?: ProjectedDataPoint) => {
    if (enableTouchTooltip) {
      action("update info panel", () => {
        uiStore.tooltipMobileData = d;
        uiStore.renderTooltipMobile = tooltipContent;
      })();
      if (setHighlighted) {
        setHighlighted(d);
      }
      if (Array.isArray(hoverAnnotation)) {
        // if there is hover behavior other than the tooltip, we want to preserve it
        const additionalHoverAnnotations: AnnotationType[] = hoverAnnotation
          .filter(
            (annotation): annotation is AnnotationType =>
              // technically only the left side of this && is the type guard
              "type" in annotation && annotation.type !== "frame-hover"
          )
          .map((annotationSpec) => {
            const clickAnnotationSpec = { ...annotationSpec };

            // hover annotation specs expect to have point data applied on the fly;
            // here we will substitute equivalent data from the click event
            Object.assign(clickAnnotationSpec, d && d.data);

            return clickAnnotationSpec;
          });

        if (additionalHoverAnnotations.length) {
          setClickAnnotations(additionalHoverAnnotations);
        }
      }
    }
  };

  childProps.customHoverBehavior = (d?: ProjectedDataPoint) => {
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
