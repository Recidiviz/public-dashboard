import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

export default function OfficeControl({ offices, onChange, value }) {
  const options = offices.map((office) => {
    return {
      id: office.id,
      label: office.label,
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

OfficeControl.propTypes = {
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

OfficeControl.defaultProps = {
  value: undefined,
};
