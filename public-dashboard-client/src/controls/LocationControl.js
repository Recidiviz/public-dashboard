import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

export default function LocationControl({ label, locations, onChange, value }) {
  const options = locations.map((location) => {
    return {
      id: location.id,
      label: location.label,
    };
  });

  return (
    <Dropdown
      label={label}
      onChange={onChange}
      options={options}
      selectedId={value}
    />
  );
}

LocationControl.propTypes = {
  label: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

LocationControl.defaultProps = {
  value: undefined,
};
