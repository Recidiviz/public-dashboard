import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import styled from "styled-components";
import {
  ControlContainer,
  ControlLabel,
  ControlValue,
  controlTypeProperties,
} from "./shared";

const DimensionControlContainer = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base};

  .DimensionControl {
    &__button {
      cursor: pointer;
    }

    &__menu {
      ${controlTypeProperties}
      background: ${(props) => props.theme.colors.controlBackground};
      list-style: none;
      margin-top: 4px;
      padding: 12px 18px;
      position: absolute;
      right: 0;
      top: 100%;
      white-space: nowrap;
      z-index: ${(props) => props.theme.zIndex.menu};
    }

    &__menu-item {
      cursor: pointer;
      margin: 8px 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const DIMENSIONS = {
  age: "Age",
  gender: "Gender",
  race: "Race",
  raceAndGender: "Race & Gender",
  total: "Total",
};

const DIMENSIONS_LIST = [
  DIMENSIONS.total,
  DIMENSIONS.race,
  DIMENSIONS.gender,
  DIMENSIONS.raceAndGender,
  DIMENSIONS.age,
];

export default function DimensionControl({ onChange }) {
  const [currentDimension, setCurrentDimension] = useState(DIMENSIONS.total);

  useEffect(() => {
    onChange(currentDimension);
  }, [currentDimension, onChange]);

  return (
    <DimensionControlContainer>
      <Wrapper onSelection={(value) => setCurrentDimension(value)}>
        <Button className="DimensionControl__button">
          <ControlLabel>View</ControlLabel>
          <ControlValue>{currentDimension}</ControlValue>
        </Button>
        <Menu className="DimensionControl__menu" tag="ul">
          {DIMENSIONS_LIST.map((dimension) => (
            <MenuItem
              key={dimension}
              tag="li"
              className="DimensionControl__menu-item"
            >
              {dimension}
            </MenuItem>
          ))}
        </Menu>
      </Wrapper>
    </DimensionControlContainer>
  );
}

DimensionControl.propTypes = {
  onChange: PropTypes.func.isRequired,
};
