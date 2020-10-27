import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";
import { DIMENSIONS_LIST } from "../constants";

export default function DimensionControl({ onChange, ...passThruProps }) {
  return (
    <Dropdown
      label="View"
      onChange={onChange}
      options={DIMENSIONS_LIST}
      {...passThruProps}
    />
  );
}

DimensionControl.propTypes = {
  onChange: PropTypes.func.isRequired,
};
