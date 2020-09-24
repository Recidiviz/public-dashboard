import PropTypes from "prop-types";
import React from "react";
import Dropdown from "./Dropdown";

export const CUSTOM_ID = "custom";

const TwoYearRangeControl = ({ onChange, value }) => {
  return (
    <Dropdown
      label="Range"
      onChange={onChange}
      options={[
        { id: "20", label: "20 years" },
        { id: "10", label: "10 years" },
        { id: "5", label: "5 years" },
        { id: "1", label: "1 year" },
        { id: CUSTOM_ID, label: "Custom" },
      ]}
      selectedId={value}
    />
  );
};

TwoYearRangeControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

TwoYearRangeControl.defaultProps = {
  value: undefined,
};

export default TwoYearRangeControl;
