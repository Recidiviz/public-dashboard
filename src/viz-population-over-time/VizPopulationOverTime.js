import { scaleTime } from "d3-scale";
import { isEqual, format, parseISO } from "date-fns";
import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";
import ResponsiveXYFrame from "semiotic/lib/ResponsiveXYFrame";
import styled from "styled-components";
import BaseChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import {
  formatAsNumber,
  recordIsTotalByDimension,
  highlightFade,
  getDataWithPct,
} from "../utils";
import {
  DIMENSION_MAPPINGS,
  DIMENSION_DATA_KEYS,
  TOTAL_KEY,
} from "../constants";
import ColorLegend from "../color-legend";

const MARGIN = { bottom: 32, left: 56, right: 8, top: 8 };

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
  }
`;

const monthToDate = (record) => parseISO(record.date_of_stay);
const dateToLabel = (date) => format(date, "MMM d y");

export default function VizPopulationOverTime({
  data: { populationOverTime },
  dimension,
  getRecordDate,
  getDateLabel,
}) {
  const [highlighted, setHighlighted] = useState();

  const dataForDimension = useMemo(() => {
    if (!dimension) return null;
    return populationOverTime.filter(recordIsTotalByDimension(dimension));
  }, [dimension, populationOverTime]);

  const chartData = useMemo(() => {
    if (!dimension) return null;

    return Array.from(DIMENSION_MAPPINGS.get(dimension), ([value, label]) => ({
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
        })),
    }));
  }, [dataForDimension, dimension, getRecordDate]);

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
  getRecordDate: PropTypes.func,
  getDateLabel: PropTypes.func,
  dimension: PropTypes.string,
};

VizPopulationOverTime.defaultProps = {
  getRecordDate: monthToDate,
  getDateLabel: dateToLabel,
  dimension: undefined,
};
