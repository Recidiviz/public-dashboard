import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";
import { DIMENSIONS_LIST } from "../constants";

export default function DimensionControl({ onChange }) {
  return (
    <Dropdown label="View" onChange={onChange} options={DIMENSIONS_LIST} />
  );
}

DimensionControl.propTypes = {
  onChange: PropTypes.func.isRequired,
};
