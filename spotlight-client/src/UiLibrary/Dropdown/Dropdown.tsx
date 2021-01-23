// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { ascending } from "d3-array";
import { useSelect } from "downshift";
import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import checkMarkPath from "../icons/checkMark.svg";
import {
  ControlLabel,
  ControlValue,
  DropdownMenu as DropdownMenuBase,
  DropdownMenuItem as DropdownMenuItemBase,
  DropdownWrapper as DropdownWrapperBase,
} from "./shared";
import { colors, highlightFade } from "../colors";

const DropdownWrapper = styled(DropdownWrapperBase)`
  /*
    increasing the z index so that following menu buttons
    don't cover this up when they are stacked
  */
  z-index: ${(props) => props.theme.zIndex.control + 1};

  ${ControlValue} {
    border: 0;
    cursor: pointer;
  }
`;

const DropdownMenu = styled(DropdownMenuBase)`
  margin: 0;
  position: absolute;
  right: 0;
  top: 100%;

  &:focus {
    outline: none;
  }
`;

const MenuItemCheckMark = styled.img`
  height: 12px;
  margin-left: 32px;
  visibility: hidden;
  width: auto;
`;

const DropdownMenuItem = styled(DropdownMenuItemBase)`
  border-bottom: 1px solid ${colors.buttonBackground};

  &[aria-selected="true"] {
    color: ${colors.textLight};

    ${MenuItemCheckMark} {
      visibility: visible;
    }
  }
`;

const MenuItemContents = styled.div`
  align-items: baseline;

  display: flex;
  justify-content: space-between;
  width: 100%;
`;

// CohortSelectMenu.propTypes = {
//   onChange: PropTypes.func.isRequired,
//   onHighlight: PropTypes.func.isRequired,
//   options: PropTypes.arrayOf(
//     and([DropdownOptionType, PropTypes.shape({ color: PropTypes.string })])
//   ).isRequired,
// };

// Dropdown.propTypes = {
//   disabled: PropTypes.bool,
//   highlighted: PropTypes.bool,
//   label: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.arrayOf(DropdownOptionType).isRequired,
//   selectedId: PropTypes.string,
// };
// export const DropdownOptionType = PropTypes.shape({
//   id: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
//   hidden: PropTypes.bool,
// });

// Dropdown.defaultProps = {
//   disabled: false,
//   highlighted: false,
//   selectedId: undefined,
// };

type DropdownOption = {
  id: string;
  label: string;
  hidden?: boolean;
};

const Dropdown: React.FC<{
  disabled?: boolean;
  highlighted?: boolean;
  label: string;
  onChange: (id: string) => void;
  options: DropdownOption[];
  selectedId: string;
}> = ({ disabled, highlighted, selectedId, label, onChange, options }) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: options.find(({ id }) => id === selectedId),
    items: options,
    onSelectedItemChange: ({ selectedItem: newSelection }) => {
      if (newSelection) {
        onChange(newSelection.id);
      }
    },
  });

  return (
    <div>
      {/* downshift handles this issue for us */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label {...getLabelProps()}>{label}</label>
      <button type="button" {...getToggleButtonProps({ disabled })}>
        {selectedItem?.label}
      </button>
      <ul {...getMenuProps()}>
        {isOpen &&
          options.map((option, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={option.id}
              {...getItemProps({ item: option, index })}
            >
              {option.label}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Dropdown;
