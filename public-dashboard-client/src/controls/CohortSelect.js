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

import useBreakpoint from "@w11r/use-breakpoint";
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
  HiddenSelect,
} from "./shared";

const SELECT_ALL_ID = "ALL";

const DropdownWrapper = styled(DropdownWrapperBase)`
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
  background-color: ${(props) => props.backgroundColor || "inherit"};
  border-bottom: 1px solid ${(props) => props.theme.colors.controlBackground};

  &[aria-selected="true"] {
    color: ${(props) => props.theme.colors.bodyLight};

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

const OPTIONS_PROP_TYPE = PropTypes.arrayOf(
  and([DropdownOptionType, PropTypes.shape({ color: PropTypes.string })])
);

function CustomSelect({
  buttonContents,
  onHighlight,
  options: optionsFromData,
  selected,
  setSelected,
}) {
  const visibleOptions = [
    { id: SELECT_ALL_ID, label: "Select all" },
    ...optionsFromData,
  ];

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useSelect({
    items: visibleOptions,
    selectedItem: null,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            // keep menu open after selection (it closes by default)
            isOpen: true,
            // keep the clicked item highlighted (highlight is cleared by default)
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
      let newSelection;

      if (selectedItem.id === SELECT_ALL_ID) {
        // if all are already selected, deselect all
        if (selected.length === optionsFromData.length) {
          newSelection = [];
        } else {
          newSelection = [...optionsFromData];
        }
      } else {
        newSelection = [...selected];

        const index = selected.indexOf(selectedItem);

        if (index === -1) {
          newSelection.push(selectedItem);
        } else {
          newSelection.splice(index, 1);
        }
        // need to keep selection sorted or labels and colors will get out of sync
        newSelection.sort((a, b) => ascending(a.label, b.label));
      }

      setSelected(newSelection);
    },
  });

  useEffect(() => {
    // index 0 is select all and should be ignored here
    if (highlightedIndex < 1) {
      onHighlight(undefined);
    } else {
      // offset by one due to select all
      onHighlight(optionsFromData[highlightedIndex - 1]);
    }
  }, [highlightedIndex, onHighlight, optionsFromData]);

  const labelProps = getLabelProps();
  const toggleButtonProps = getToggleButtonProps();
  return (
    <>
      <ControlLabel as="label" {...labelProps}>
        Cohort
      </ControlLabel>
      <ControlValue as="button" type="button" {...toggleButtonProps}>
        {buttonContents}
      </ControlValue>
      <DropdownMenu {...getMenuProps()} as="ul">
        {isOpen &&
          visibleOptions.map((opt, index) => {
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
    </>
  );
}

CustomSelect.propTypes = {
  buttonContents: PropTypes.node.isRequired,
  onHighlight: PropTypes.func.isRequired,
  options: OPTIONS_PROP_TYPE.isRequired,
  selected: OPTIONS_PROP_TYPE.isRequired,
  setSelected: PropTypes.func.isRequired,
};

function NativeSelect({ buttonContents, options, selected, setSelected }) {
  return (
    <>
      <ControlLabel aria-hidden>Cohort</ControlLabel>
      <ControlValue aria-hidden>{buttonContents}</ControlValue>
      <HiddenSelect
        aria-label="Cohort"
        multiple
        onChange={(event) => {
          const currentlySelectedIds = [...event.target.options]
            .filter((opt) => opt.selected)
            .map((opt) => opt.value);
          setSelected(
            options.filter((opt) => currentlySelectedIds.includes(opt.id))
          );
        }}
        value={selected.map((opt) => opt.id)}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </HiddenSelect>
    </>
  );
}

NativeSelect.propTypes = {
  buttonContents: PropTypes.node.isRequired,
  options: OPTIONS_PROP_TYPE.isRequired,
  selected: OPTIONS_PROP_TYPE.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default function CohortSelectMenu({ onChange, onHighlight, options }) {
  const [selected, setSelected] = useState(options);

  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  const firstSelected = selected[0];
  const buttonContents = (
    <>
      {!firstSelected && "Select …"}
      {firstSelected && firstSelected.label}
      {selected.length > 1 && (
        <em>
          &nbsp;and {selected.length - 1} other{selected.length > 2 ? "s" : ""}
        </em>
      )}
    </>
  );

  const renderNativeSelect = useBreakpoint(false, ["mobile-", true]);

  return (
    <DropdownWrapper>
      {renderNativeSelect ? (
        <NativeSelect
          buttonContents={buttonContents}
          options={options}
          selected={selected}
          setSelected={setSelected}
        />
      ) : (
        <CustomSelect
          buttonContents={buttonContents}
          onHighlight={onHighlight}
          options={options}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </DropdownWrapper>
  );
}

CohortSelectMenu.propTypes = {
  onChange: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    and([DropdownOptionType, PropTypes.shape({ color: PropTypes.string })])
  ).isRequired,
};
