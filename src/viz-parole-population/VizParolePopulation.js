import React from "react";
import PopulationViz, { basePopulationVizPropTypes } from "../population-viz";
import StateCountyMap from "../state-county-map";
import { locationTotals } from "../utils";

export default function VizParolePopulation(props) {
  const {
    data: { populationDemographics, locations },
    locationId,
    onLocationClick,
  } = props;

  const locationAccessorFn = (record) => record.district;
  const populationAccessorFn = (record) =>
    Number(record.total_supervision_count);

  return (
    <PopulationViz
      {...props}
      MapComponent={StateCountyMap}
      mapComponentProps={{
        data: locationTotals(
          populationDemographics,
          locations,
          populationAccessorFn,
          locationAccessorFn
        ),
        currentLocation: locationId,
        onLocationClick,
      }}
      mapLabel="Parole offices in North Dakota"
      locationAccessorFn={locationAccessorFn}
      populationAccessorFn={populationAccessorFn}
      totalPopulationLabel="People on parole"
    />
  );
}

VizParolePopulation.propTypes = basePopulationVizPropTypes;
