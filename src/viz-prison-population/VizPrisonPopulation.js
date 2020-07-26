import React from "react";
import PopulationViz, { basePopulationVizPropTypes } from "../population-viz";
import StateCountyMap from "../state-county-map";
import { locationTotals } from "../utils";

export default function VizPrisonPopulation(props) {
  const {
    data: { populationDemographics, locations },
    locationId,
    onLocationClick,
  } = props;

  const locationAccessorFn = (record) => record.facility;
  const populationAccessorFn = (record) => Number(record.total_population);

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
      mapLabel="Prison facilities in North Dakota"
      locationAccessorFn={locationAccessorFn}
      populationAccessorFn={populationAccessorFn}
      totalPopulationLabel="People on prison"
    />
  );
}

VizPrisonPopulation.propTypes = basePopulationVizPropTypes;
