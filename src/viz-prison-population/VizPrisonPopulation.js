import PropTypes from "prop-types";
import React from "react";

import PopulationViz from "../population-viz";
import StateOfficeMap from "../state-office-map";
import { recordIsTotal } from "../utils";

export default function VizPrisonPopulation(props) {
  const {
    data: { populationDemographics, locations: facilities },
    locationId: facilityId,
    onLocationClick: onFacilityClick,
  } = props;

  const facilityTotals = populationDemographics
    .filter(recordIsTotal)
    .map((record) => {
      const facilityData = facilities.find(
        // these are stored as both strings and numbers;
        // doing an extra typecast here just to be safe
        (facility) => `${facility.facility}` === `${record.facility}`
      );
      if (facilityData) {
        return {
          office: `${record.facility}`,
          lat: facilityData.lat,
          long: facilityData.long,
          value: +record.total_population,
        };
      }
      return null;
    })
    // drop any nulls from the previous step
    .filter((record) => record);

  return (
    <PopulationViz
      {...props}
      MapComponent={StateOfficeMap}
      mapComponentProps={{
        data: facilityTotals,
        currentOffice: facilityId,
        onOfficeClick: onFacilityClick,
      }}
      mapLabel="Prison facilities in North Dakota"
      locationAccessorFn={(record) => record.facility}
      populationAccessorFn={(record) => Number(record.total_population)}
      totalPopulationLabel="People on prison"
    />
  );
}

VizPrisonPopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  locationId: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired,
};

VizPrisonPopulation.defaultProps = {
  locationId: undefined,
};
