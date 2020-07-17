import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

export default function DistrictControl({ districts, onChange, value }) {
  const options = districts.map((district) => {
    return {
      id: district.id,
      label: district.label,
    };
  });

  return (
    <Dropdown
      label="Office"
      onChange={onChange}
      options={options}
      selectedId={value}
    />
  );
}

DistrictControl.propTypes = {
  districts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

DistrictControl.defaultProps = {
  value: undefined,
};
