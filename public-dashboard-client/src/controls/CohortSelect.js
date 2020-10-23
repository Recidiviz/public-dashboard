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

import { and } from "airbnb-prop-types";
import { ascending } from "d3-array";
import { useSelect } from "downshift";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import checkMarkPath from "../assets/icons/checkMark.svg";
import {
  ControlLabel,
  ControlValue,
  DropdownMenu as DropdownMenuBase,
  DropdownMenuItem as DropdownMenuItemBase,
  DropdownOptionType,
  DropdownWrapper as DropdownWrapperBase,
} from "./shared";

const DropdownWrapper = styled(DropdownWrapperBase)`
  ${ControlValue} {
    border: 0;
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

const DropdownMenuItem = styled(DropdownMenuItemBase)`
  background-color: ${(props) => props.backgroundColor || "inherit"};
  border-bottom: 1px solid ${(props) => props.theme.colors.controlBackground};

  &[aria-selected="true"] {
    color: ${(props) => props.theme.colors.bodyLight};
  }
`;

const MenuItemContents = styled.div`
  align-items: baseline;

  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const MenuItemCheckMark = styled.img`
  height: 12px;
  margin-left: 32px;
  visibility: hidden;
  width: auto;

  [aria-selected="true"] & {
    visibility: visible;
  }
`;

export default function CohortSelectMenu({ onChange, onHighlight, options }) {
  const [selected, setSelected] = useState(options);

  useEffect(() => {
    onChange(selected.map((opt) => opt.id));
  }, [onChange, selected]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useSelect({
    items: options,
    selectedItem: null,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep menu open after selection.
            highlightedIndex: state.highlightedIndex,
          };
        default:
          return changes;
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      const index = selected.indexOf(selectedItem);
      let newSelection;
      if (index > 0) {
        newSelection = [
          ...selected.slice(0, index),
          ...selected.slice(index + 1),
        ];
      } else if (index === 0) {
        newSelection = [...selected.slice(1)];
      } else {
        newSelection = [...selected, selectedItem];
      }
      newSelection.sort((a, b) => ascending(a.label, b.label));
      setSelected(newSelection);
    },
  });

  useEffect(() => {
    if (highlightedIndex === -1) {
      onHighlight(undefined);
    } else {
      onHighlight(options[highlightedIndex]);
    }
  }, [highlightedIndex, onHighlight, options]);

  const firstSelected = selected[0];
  const buttonContents = (
    <>
      {!firstSelected && "Select..."}
      {firstSelected && firstSelected.label}
      {selected.length > 1 && (
        <em>
          &nbsp;and {selected.length - 1} other{selected.length > 2 ? "s" : ""}
        </em>
      )}
    </>
  );

  return (
    <DropdownWrapper>
      <ControlLabel as="label" {...getLabelProps()}>
        Cohort
      </ControlLabel>
      <ControlValue as="button" type="button" {...getToggleButtonProps()}>
        {buttonContents}
      </ControlValue>
      <DropdownMenu {...getMenuProps()} as="ul">
        {isOpen &&
          options.map((opt, index) => {
            const isSelected = selected.includes(opt);
            const itemProps = getItemProps({ item: opt, index });
            return (
              <DropdownMenuItem
                {...itemProps}
                aria-selected={isSelected}
                as="li"
                backgroundColor={isSelected ? opt.color : undefined}
                highlightedSelector={
                  highlightedIndex === index ? `&#${itemProps.id}` : undefined
                }
                key={opt.id}
              >
                <MenuItemContents>
                  {opt.label}
                  <MenuItemCheckMark src={checkMarkPath} />
                </MenuItemContents>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenu>
    </DropdownWrapper>
  );
}

CohortSelectMenu.propTypes = {
  onChange: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    and([
      DropdownOptionType,
      PropTypes.shape({ color: PropTypes.string.isRequired }),
    ])
  ).isRequired,
};
