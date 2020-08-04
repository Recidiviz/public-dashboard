import classNames from "classnames";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
} from "@reach/menu-button";
import styled from "styled-components";
import {
  ControlContainer,
  ControlLabel,
  ControlValue,
  controlTypeProperties,
  DropdownOptionType,
} from "./shared";

const DropdownWrapper = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.menu};

  &.Dropdown--highlighted {
    ${ControlValue} {
      background: ${(props) => props.theme.colors.highlight};
      color: ${(props) => props.theme.colors.bodyLight};
    }
  }

  [data-reach-menu-button] {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
`;

const DropdownMenu = styled.div`
  ${controlTypeProperties}

  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: 15px;
  list-style: none;
  padding: 12px 0;
  position: relative;
  white-space: nowrap;
  z-index: ${(props) => props.theme.zIndex.menu};


  [data-reach-menu-items] {
    &:focus {
      outline: none;
    }
  }

  [data-reach-menu-item] {
    cursor: pointer;
    padding: 6px 18px;
    transition: all ${(props) => props.theme.transition.defaultTimeSettings};

    &[data-selected],
    &:hover {
      background: ${(props) => props.theme.colors.highlight};
      color: ${(props) => props.theme.colors.bodyLight};
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
    <DropdownWrapper
      className={classNames({
        "Dropdown--highlighted":
          // selecting something other than the default (first) option
          // causes a highlight
          highlighted || currentOptionId !== options[0].id,
      })}
    >
      <Menu>
        <ControlContainer>
          <ControlLabel>{label}</ControlLabel>
          <MenuButton>
            <ControlValue>{selectedOption.label}</ControlValue>
          </MenuButton>
          <MenuPopover>
            <DropdownMenu>
              <MenuItems>
                {options.map((option) => (
                  <MenuItem
                    key={option.id}
                    onSelect={() => setCurrentOptionId(option.id)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuItems>
            </DropdownMenu>
          </MenuPopover>
        </ControlContainer>
      </Menu>
    </DropdownWrapper>
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
