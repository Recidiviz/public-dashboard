import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";
import { TOTAL_KEY } from "../constants";
import { DropdownOption } from "./shared";

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
      value={value}
    />
  );
}

DistrictControl.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape(DropdownOption),
};

DistrictControl.defaultProps = {
  value: undefined,
};
