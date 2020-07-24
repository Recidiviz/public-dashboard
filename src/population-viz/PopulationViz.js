import { group, sum } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  DIMENSION_MAPPINGS,
  THEME,
} from "../constants";
import {
  formatAsNumber,
  formatDemographicValue,
  recordIsTotal,
} from "../utils";
import ProportionalBar from "../proportional-bar";

import Statistic from "../statistic";

const BAR_CHART_VISUALIZATION_COLORS = {
  [DIMENSION_KEYS.gender]: THEME.colors.gender,
  [DIMENSION_KEYS.age]: THEME.colors.age,
  [DIMENSION_KEYS.race]: THEME.colors.race,
};

const BAR_CHART_HEIGHT = 43;

const PopulationVizWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const GUTTER_WIDTH = "56px";

const VizWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  margin-bottom: 24px;
  min-width: 340px;
  width: calc((100% - ${GUTTER_WIDTH}) / 2);
`;

const Gutter = styled.div`
  height: 1px;
  width: ${GUTTER_WIDTH};
`;

const MapWrapper = styled.figure`
  margin: 0;
  padding-top: 24px;
  width: 100%;
`;

const MapCaption = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

const DemographicsWrapper = styled.div`
  height: 100%;
  margin: 0;
  width: 100%;
`;

const DemographicsTotalCountWrapper = styled.div`
  margin-bottom: 16px;
  text-align: right;
`;

const DemographicsBarChartWrapper = styled.div`
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.base + props.stackOrder};
`;

function DemographicBarChart({ data, dimension, stackOrder }) {
  if (!data) return null;

  const dimensionData = Array.from(DIMENSION_MAPPINGS.get(dimension))
    .map(([demographic]) => {
      return data
        .filter(
          (record) => record[DIMENSION_DATA_KEYS[dimension]] === demographic
        )
        .map((record) => ({
          color: BAR_CHART_VISUALIZATION_COLORS[dimension][demographic],
          label: formatDemographicValue(demographic, dimension),
          value: Number(record.total_supervision_count),
        }))
        .shift();
    })
    .filter((record) => record);

  return (
    <DemographicsBarChartWrapper stackOrder={stackOrder}>
      <ProportionalBar
        data={dimensionData}
        height={BAR_CHART_HEIGHT}
        title={DIMENSION_LABELS[dimension]}
      />
    </DemographicsBarChartWrapper>
  );
}

DemographicBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  dimension: PropTypes.string.isRequired,
  stackOrder: PropTypes.number.isRequired,
};

DemographicBarChart.defaultProps = {
  data: undefined,
};

export default function PopulationViz({
  data: { populationDemographics },
  locationId,
  MapComponent,
  mapComponentProps,
  mapLabel,
  locationAccessorFn,
  populationAccessorFn,
  totalPopulationLabel,
}) {
  // location may not be defined when first mounted; wait for it
  if (!locationId) return null;

  const filteredData = group(populationDemographics, locationAccessorFn).get(
    locationId
  );

  const totalPopulation = sum(
    filteredData.filter(recordIsTotal).map(populationAccessorFn)
  );

  return (
    <PopulationVizWrapper>
      <VizWrapper>
        <Measure bounds>
          {({
            measureRef,
            contentRect: {
              bounds: { width },
            },
          }) => (
            <MapWrapper ref={measureRef}>
              <MapComponent {...mapComponentProps} width={width} />
              <MapCaption>{mapLabel}</MapCaption>
            </MapWrapper>
          )}
        </Measure>
      </VizWrapper>
      <Gutter />
      <VizWrapper>
        <DemographicsWrapper>
          <DemographicsTotalCountWrapper>
            <Statistic
              value={formatAsNumber(totalPopulation)}
              label={totalPopulationLabel}
            />
          </DemographicsTotalCountWrapper>
          {Array.from(
            DIMENSION_MAPPINGS,
            ([dimension], index) =>
              dimension !== DIMENSION_KEYS.total && (
                <DemographicBarChart
                  key={dimension}
                  data={filteredData}
                  dimension={dimension}
                  stackOrder={DIMENSION_MAPPINGS.size - index}
                />
              )
          )}
        </DemographicsWrapper>
      </VizWrapper>
    </PopulationVizWrapper>
  );
}

PopulationViz.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  locationAccessorFn: PropTypes.func.isRequired,
  locationId: PropTypes.string,
  MapComponent: PropTypes.func.isRequired,
  mapComponentProps: PropTypes.objectOf(PropTypes.any).isRequired,
  mapLabel: PropTypes.string.isRequired,
  onLocationClick: PropTypes.func.isRequired,
  populationAccessorFn: PropTypes.func.isRequired,
  totalPopulationLabel: PropTypes.string.isRequired,
};

PopulationViz.defaultProps = {
  locationId: undefined,
};
