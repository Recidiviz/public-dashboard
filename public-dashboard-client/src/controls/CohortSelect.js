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
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ControlContainer,
  ControlLabel,
  ControlValue,
  controlTypeProperties,
  DropdownOptionType,
} from "./shared";

const DropdownMenu = styled.ul`
  ${controlTypeProperties}

  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: 15px;
  list-style: none;
  padding: 12px 0;
  position: relative;
  white-space: nowrap;
  z-index: ${(props) => props.theme.zIndex.menu};
`;

const DropdownMenuItem = styled.li`
  ${(props) => (props.highlighted ? "outline: solid;" : "")}
`;

export default function CohortSelectMenu({ onChange, options }) {
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

  const firstSelected = selected[0];
  const buttonContents = (
    <>
      {!firstSelected && "Select..."}
      {firstSelected && firstSelected.label}{" "}
      {selected.length > 1 && <em>and {selected.length - 1} others</em>}
    </>
  );

  return (
    <ControlContainer>
      <ControlLabel as="label" {...getLabelProps()}>
        Cohort
      </ControlLabel>
      <ControlValue as="button" type="button" {...getToggleButtonProps()}>
        {buttonContents}
      </ControlValue>
      <DropdownMenu {...getMenuProps()}>
        {isOpen &&
          options.map((opt, index) => {
            const isSelected = selected.includes(opt);
            return (
              <DropdownMenuItem
                {...getItemProps({ item: opt, index })}
                aria-selected={isSelected}
                highlighted={highlightedIndex === index}
                key={opt.id}
              >
                {opt.label}
                <input
                  checked={isSelected}
                  onChange={() => null}
                  type="checkbox"
                  value={opt.id}
                />
              </DropdownMenuItem>
            );
          })}
      </DropdownMenu>
    </ControlContainer>
  );
}

CohortSelectMenu.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(DropdownOptionType).isRequired,
};
