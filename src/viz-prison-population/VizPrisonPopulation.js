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
      mapLabel="Facilities housing individuals under legal and physical custody of the ND DOCR"
      locationAccessorFn={locationAccessorFn}
      populationAccessorFn={populationAccessorFn}
      totalPopulationLabel="People in prison"
    />
  );
}

VizPrisonPopulation.propTypes = basePopulationVizPropTypes;
