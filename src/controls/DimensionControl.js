import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

const DIMENSIONS = {
  age: "Age",
  gender: "Gender",
  race: "Race",
  raceAndGender: "Race & Gender",
  total: "Total",
};

const DIMENSIONS_LIST = [
  { id: "total", label: DIMENSIONS.total },
  { id: "race", label: DIMENSIONS.race },
  { id: "gender", label: DIMENSIONS.gender },
  { id: "raceAndGender", label: DIMENSIONS.raceAndGender },
  { id: "age", label: DIMENSIONS.age },
];

export default function DimensionControl({ onChange }) {
  return (
    <Dropdown label="View" onChange={onChange} options={DIMENSIONS_LIST} />
  );
}

DimensionControl.propTypes = {
  onChange: PropTypes.func.isRequired,
};
