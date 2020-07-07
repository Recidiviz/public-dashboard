import PropTypes from "prop-types";
import React from "react";
import { TOTAL_KEY } from "../constants";
import StateDistrictMap from "../state-district-map";

export default function VizParolePopulation({
  data: { populationDemographics, districtOffices },
}) {
  const districtTotals = populationDemographics
    .filter(
      (record) =>
        record.race_or_ethnicity === TOTAL_KEY &&
        record.gender === TOTAL_KEY &&
        record.age_bucket === TOTAL_KEY
    )
    .map((record) => {
      const districtData = districtOffices.find(
        (office) => +office.district === +record.district
      );
      if (districtData) {
        return {
          district: `${record.district}`,
          lat: districtData.lat,
          long: districtData.long,
          value: +record.total_supervision_count,
        };
      }
      return null;
    })
    .filter((record) => record);
  return <StateDistrictMap data={districtTotals} />;
}

// TODO: figure this out
// const ControlOptionType = PropTypes.shape({
//   id: string,
//   label: string,
// });

VizParolePopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    districtOffices: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  // dimension: ControlOptionType,
  // month: ControlOptionType,
  // district: ControlOptionType,
};

VizParolePopulation.defaultProps = {
  // dimension: undefined,
  // month: undefined,
  // district: undefined,
};
