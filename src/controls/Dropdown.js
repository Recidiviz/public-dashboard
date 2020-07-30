import classNames from "classnames";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import styled from "styled-components";
import {
  ControlContainer,
  ControlLabel,
  ControlValue,
  controlTypeProperties,
  DropdownOptionType,
} from "./shared";

const DropdownContainer = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.menu};

  .Dropdown {
    &__button {
      cursor: pointer;

      &--highlighted {
        ${ControlValue} {
          background: ${(props) => props.theme.colors.highlight};
          color: ${(props) => props.theme.colors.bodyLight};
        }
      }
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

// if selectedId prop is provided, this behaves like a controlled component;
// in the absence of that it will be uncontrolled and expose the ID of
// its selected option via a listener
export default function Dropdown({
  highlighted,
  label,
  onChange,
  options,
  selectedId,
}) {
  const [currentOptionId, setCurrentOptionId] = useState(
    selectedId || options[0].id
  );
  const selectedOption = options.find(
    (option) => option.id === currentOptionId
  );

  // this lets the parent listen to the selected value
  useEffect(() => {
    onChange(currentOptionId);
  }, [currentOptionId, onChange]);

  // this lets the parent explicitly set the selected value
  useEffect(() => {
    if (selectedId) {
      setCurrentOptionId(selectedId);
    }
  }, [selectedId]);

  return (
    <DropdownContainer>
      <Wrapper
        onSelection={(selectedValue) => setCurrentOptionId(selectedValue.id)}
      >
        <Button
          className={classNames("Dropdown__button", {
            "Dropdown__button--highlighted": highlighted,
          })}
        >
          <ControlLabel>{label}</ControlLabel>
          <ControlValue>{selectedOption.label}</ControlValue>
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
  highlighted: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(DropdownOptionType).isRequired,
  selectedId: PropTypes.string,
};

Dropdown.defaultProps = {
  highlighted: false,
  selectedId: undefined,
};
