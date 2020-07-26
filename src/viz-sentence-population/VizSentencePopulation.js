import React from "react";
import StateJudicialDistrictMap from "../state-judicial-district-map";
import PopulationViz, { basePopulationVizPropTypes } from "../population-viz";
import { judicialDistrictTotals } from "../utils";

export default function VizSentencePopulation(props) {
  const {
    data: { populationDemographics, locations },
    locationId,
    onLocationClick,
  } = props;

  const populationAccessorFn = (record) =>
    Number(record.incarceration_count) + Number(record.probation_count);

  return (
    <PopulationViz
      {...props}
      MapComponent={StateJudicialDistrictMap}
      mapComponentProps={{
        data: judicialDistrictTotals(
          populationDemographics,
          locations,
          populationAccessorFn
        ),
        currentLocation: locationId,
        onLocationClick,
      }}
      mapLabel="Judicial districts in North Dakota"
      locationAccessorFn={(record) => record.district}
      populationAccessorFn={populationAccessorFn}
      totalPopulationLabel="People sentenced"
    />
  );
}

VizSentencePopulation.propTypes = basePopulationVizPropTypes;
