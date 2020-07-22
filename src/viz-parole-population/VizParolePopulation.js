import PropTypes from "prop-types";
import React from "react";

import PopulationViz from "../population-viz";
import StateOfficeMap from "../state-office-map";
import { recordIsTotal } from "../utils";

export default function VizParolePopulation(props) {
  const {
    data: { populationDemographics, locations: paroleOffices },
    locationId: officeId,
    onLocationClick: onOfficeClick,
  } = props;

  const officeTotals = populationDemographics
    .filter(recordIsTotal)
    .map((record) => {
      const officeData = paroleOffices.find(
        // these are stored as both strings and numbers;
        // doing an extra typecast here just to be safe
        (office) => `${office.district}` === `${record.district}`
      );
      if (officeData) {
        return {
          office: `${record.district}`,
          lat: officeData.lat,
          long: officeData.long,
          value: +record.total_supervision_count,
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
        data: officeTotals,
        currentOffice: officeId,
        onOfficeClick,
      }}
      mapLabel="Parole offices in North Dakota"
      locationAccessorFn={(record) => record.district}
      populationAccessorFn={(record) => Number(record.total_supervision_count)}
      totalPopulationLabel="People on parole"
    />
  );
}

VizParolePopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  locationId: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired,
};

VizParolePopulation.defaultProps = {
  locationId: undefined,
};
