import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";
import { TOTAL_KEY } from "../constants";

export default function DistrictControl({ districts, onChange, value }) {
  const options = districts.map((districtId) => {
    return {
      id: districtId,
      label: districtId === TOTAL_KEY ? "All" : districtId,
    };
  });

  return (
    <Dropdown
      label="District"
      onChange={onChange}
      options={options}
      selectedId={value}
    />
  );
}

DistrictControl.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

DistrictControl.defaultProps = {
  value: undefined,
};
