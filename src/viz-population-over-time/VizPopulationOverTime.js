import { ascending } from "d3-array";
import { scaleTime } from "d3-scale";
import { parseISO, isEqual, format } from "date-fns";
import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";
import ResponsiveXYFrame from "semiotic/lib/ResponsiveXYFrame";
import styled from "styled-components";
import BaseChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import {
  formatAsNumber,
  getDataWithPct,
  highlightFade,
  recordIsTotalByDimension,
} from "../utils";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_MAPPINGS,
  DIMENSION_DATA_KEYS,
  TOTAL_KEY,
} from "../constants";
import ColorLegend from "../color-legend";

const MARGIN = { bottom: 40, left: 56, right: 8, top: 8 };

const Wrapper = styled.div``;

const LegendWrapper = styled.div`
  margin-top: 24px;
  padding-left: ${MARGIN.left}px;
`;

const ChartWrapper = styled(BaseChartWrapper)`
  .frame {
    circle.frame-hover {
      display: none;
    }

    path.subject {
      stroke: ${(props) => props.theme.colors.highlight};
    }

    .visualization-layer {
      shape-rendering: geometricPrecision;
    }

    .xyframe-line {
      transition: fill ${(props) => props.theme.transition.defaultTimeSettings};
    }

    .axis.x {
      text.axis-label {
        transform: rotate(-45deg);
      }
    }
  }
`;

const getRecordDate = (record) => parseISO(record.population_date);
const getDateLabel = (date) => format(date, "MMM d y");

export default function VizPopulationOverTime({
  data: { populationOverTime },
  dimension,
}) {
  const [highlighted, setHighlighted] = useState();

  const dataForDimension = useMemo(() => {
    if (!dimension) return null;
    return populationOverTime.filter(recordIsTotalByDimension(dimension));
  }, [dimension, populationOverTime]);

  const chartData = useMemo(() => {
    if (!dimension) return null;

    return (
      Array.from(DIMENSION_MAPPINGS.get(dimension))
        // don't need to include unknown in this chart;
        // they are minimal to nonexistent in historical data and make the legend confusing
        .filter(([value]) => value !== DEMOGRAPHIC_UNKNOWN)
        .map(([value, label]) => ({
          label,
          color:
            value === TOTAL_KEY
              ? THEME.colors.populationTimeseriesTotal
              : THEME.colors[dimension][value],
          coordinates: dataForDimension
            .filter((record) =>
              value === TOTAL_KEY
                ? true
                : record[DIMENSION_DATA_KEYS[dimension]] === value
            )
            .map((record) => ({
              time: getRecordDate(record),
              population: Number(record.population_count),
            }))
            .sort((a, b) => ascending(a.time, b.time)),
        }))
    );
  }, [dataForDimension, dimension]);

  if (!dimension) return null;

  return (
    <Wrapper>
      <ChartWrapper>
        <ResponsiveTooltipController
          getTooltipProps={(d) => {
            const dateHovered = d.time;
            return {
              title: getDateLabel(dateHovered),
              records: getDataWithPct(
                d.points
                  .filter((p) => isEqual(p.data.time, dateHovered))
                  .map((p) => ({
                    label: p.parentLine.label,
                    value: p.data.population,
                  }))
              ),
            };
          }}
          hoverAnnotation={[
            { type: "x", disable: ["connector", "note"] },
            { type: "frame-hover" },
          ]}
        >
          <ResponsiveXYFrame
            axes={[
              {
                orient: "left",
                tickFormat: formatAsNumber,
                tickLineGenerator: () => null,
              },
              {
                orient: "bottom",
                tickFormat: (time) => format(time, "y"),
                tickLineGenerator: () => null,
              },
            ]}
            baseMarkProps={{
              // this disables JS animations
              // (we have implemented CSS transitions instead, which perform better here)
              forceUpdate: true,
            }}
            lines={chartData}
            lineStyle={(d) => ({
              fill:
                highlighted && highlighted.label !== d.label
                  ? highlightFade(d.color)
                  : d.color,
              stroke: THEME.colors.background,
              strokeWidth: 1,
            })}
            lineType={{ type: "stackedarea", sort: null }}
            margin={MARGIN}
            pointStyle={{ display: "none" }}
            responsiveWidth
            // showLinePoints="top"
            size={[undefined, 430]}
            xAccessor="time"
            xScaleType={scaleTime()}
            yAccessor="population"
            yExtent={[0]}
          />
        </ResponsiveTooltipController>
      </ChartWrapper>
      <LegendWrapper>
        <ColorLegend
          highlighted={highlighted}
          items={chartData}
          setHighlighted={setHighlighted}
        />
      </LegendWrapper>
    </Wrapper>
  );
}

VizPopulationOverTime.propTypes = {
  data: PropTypes.shape({
    populationOverTime: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
};

VizPopulationOverTime.defaultProps = {
  dimension: undefined,
};
