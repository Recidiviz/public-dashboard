// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { useSelect } from "downshift";
import xor from "lodash.xor";
import { rem } from "polished";
import React from "react";
import { useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { Assign } from "utility-types";
import { colors } from "..";
import { highlightFade } from "../../charts/utils";
import Check from "../Check";
import {
  DropdownBase,
  DropdownCommonProps,
  DropdownMenuItem,
  DropdownMenuItemContents,
  DropdownOption,
} from "./common";

const SELECT_ALL_ID = "__ALL__";

const CheckMarkWrapper = styled.span`
  display: inline-block;
  margin-left: ${rem(32)};
`;

type MultipleSelectProps = Assign<
  DropdownCommonProps,
  {
    options: (DropdownOption & { color?: string })[];
    onChange: (ids: string[]) => void;
    selectedIds: string[];
    onHighlight?: (id?: string) => void;
  }
>;

function DropdownMultiple({
  selectedIds,
  onChange,
  onHighlight,
  options,
  disabled,
  ...passThruProps
}: MultipleSelectProps): React.ReactElement | null {
  const optionsWithSelectAll = [
    {
      id: SELECT_ALL_ID,
      label:
        options.length === selectedIds.length ? "Deselect all" : "Select all",
    },
    ...options,
  ];

  const firstSelected = options.find(({ id }) => id === selectedIds[0]);
  const buttonContents = (
    <>
      {!firstSelected && "Select …"}
      {firstSelected && firstSelected.label}
      {selectedIds.length > 1 && (
        <em>
          &nbsp;and {selectedIds.length - 1} other
          {selectedIds.length > 2 ? "s" : ""}
        </em>
      )}
    </>
  );

  // animate menu item highlight states
  /**
   * Returns a setter function for useSprings that accounts for
   * color-coding with respect to both active selection and highlight state
   */
  const getColorSetter = (selection: string[], highlightedIndex?: number) => (
    index: number
  ) => {
    // default base and highlight states; options with color coding may override
    let background =
      highlightedIndex === index
        ? colors.buttonBackgroundHover
        : colors.buttonBackground;
    let color = colors.text;

    const option = optionsWithSelectAll[index];

    // options can be color-coded:
    // - use color to indicate both selected and highlighted
    // - use faded color to indicate selected when another is highlighted
    // - use default menu color if neither selected nor highlighted
    if (option.color) {
      if (selection.includes(option.id)) {
        background = option.color;
        color = colors.textLight;

        // OK to skip zero here because it's Select All
        if (highlightedIndex && highlightedIndex !== -1) {
          background = highlightFade(option.color);
        }
      }

      if (highlightedIndex === index) {
        background = option.color;
        color = colors.textLight;
      }
    }

    return { background, color };
  };

  const [menuItemsStyles, setMenuItemsStyles] = useSprings(
    optionsWithSelectAll.length,
    getColorSetter(selectedIds)
  );

  return (
    <DropdownBase
      {...passThruProps}
      buttonContents={buttonContents}
      disabled={disabled}
      options={optionsWithSelectAll}
      renderOption={({ getItemProps, option, index }) => {
        const itemProps = getItemProps({
          item: option,
          index,
          disabled,
        });

        // Downshift doesn't compute multiple selection but we can override
        const isOptionSelected = Boolean(selectedIds.includes(option.id));
        if (isOptionSelected) {
          itemProps["aria-selected"] = true;
        }

        return (
          <DropdownMenuItem key={option.id} {...itemProps}>
            <DropdownMenuItemContents style={menuItemsStyles[index]}>
              {option.label}
              {
                // skipping zero because it's Select All
                index > 0 && (
                  <CheckMarkWrapper>
                    <Check visible={isOptionSelected} />
                  </CheckMarkWrapper>
                )
              }
            </DropdownMenuItemContents>
          </DropdownMenuItem>
        );
      }}
      selectProps={{
        // we will manage selection state ourselves and update options accordingly
        selectedItem: null,
        stateReducer: (state, actionAndChanges) => {
          const { changes, type } = actionAndChanges;
          switch (type) {
            case useSelect.stateChangeTypes.MenuKeyDownEnter:
            case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
            case useSelect.stateChangeTypes.ItemClick:
              // preserve menu state for additional selections
              changes.isOpen = true;
              changes.highlightedIndex = state.highlightedIndex;
              return changes;
            default:
              return changes;
          }
        },
        onSelectedItemChange: ({ selectedItem, highlightedIndex }) => {
          if (selectedItem) {
            let newSelection: string[] = [];

            if (selectedItem.id === SELECT_ALL_ID) {
              // if all are already selected, deselect all
              if (selectedIds.length !== options.length) {
                newSelection = options.map(({ id }) => id);
              }
            } else {
              newSelection = xor(selectedIds, [selectedItem.id]);
            }

            onChange(newSelection);

            // @ts-expect-error error in type defs:
            // https://github.com/pmndrs/react-spring/issues/883
            setMenuItemsStyles(getColorSetter(newSelection, highlightedIndex));
          }
        },
        onHighlightedIndexChange: ({ highlightedIndex }) => {
          if (onHighlight) {
            const highlightedId =
              highlightedIndex !== undefined
                ? optionsWithSelectAll[highlightedIndex]?.id
                : undefined;
            if (highlightedId !== SELECT_ALL_ID) {
              onHighlight(highlightedId);
            } else {
              onHighlight();
            }

            // @ts-expect-error error in type defs:
            // https://github.com/pmndrs/react-spring/issues/883
            setMenuItemsStyles(getColorSetter(selectedIds, highlightedIndex));
          }
        },
      }}
    />
  );
}

export default DropdownMultiple;
