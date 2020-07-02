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

const DropdownContainer = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base};

  .Dropdown {
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

export default function Dropdown({ label, onChange, options }) {
  const [currentOption, setCurrentOption] = useState(options[0]);

  useEffect(() => {
    onChange(currentOption);
  }, [currentOption, onChange]);

  return (
    <DropdownContainer>
      <Wrapper onSelection={(value) => setCurrentOption(value)}>
        <Button className="Dropdown__button">
          <ControlLabel>{label}</ControlLabel>
          <ControlValue>{currentOption.label}</ControlValue>
        </Button>
        <Menu className="Dropdown__menu" tag="ul">
          {options.map((option) => (
            <MenuItem
              className="Dropdown__menu-item"
              key={option.id}
              tag="li"
              value={option}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Wrapper>
    </DropdownContainer>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
