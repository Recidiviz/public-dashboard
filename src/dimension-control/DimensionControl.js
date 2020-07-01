import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import styled, { css } from "styled-components";

const PILL_HEIGHT = 32;

const dimensionTypeProperties = css`
  font: ${(props) => props.theme.fonts.body};
  font-size: 10px;
`;

const DimensionControlContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${PILL_HEIGHT}px;
  margin-left: 10px;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base};

  .DimensionControl {
    &__button {
      cursor: pointer;
    }

    &__menu {
      ${dimensionTypeProperties}
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

const DimensionControlLabel = styled.span`
  display: inline-block;
  font: ${(props) => props.theme.fonts.bodyBold};
  font-size: 10px;
  margin-right: 8px;
`;

const DimensionControlValue = styled.span`
  ${dimensionTypeProperties}
  align-items: center;
  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: ${PILL_HEIGHT / 2}px;
  display: inline-flex;
  height: ${PILL_HEIGHT}px;
  justify-content: center;
  min-width: ${PILL_HEIGHT * 1.5}px;
  padding: 8px;
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
          <DimensionControlLabel>View</DimensionControlLabel>
          <DimensionControlValue>{currentDimension}</DimensionControlValue>
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
