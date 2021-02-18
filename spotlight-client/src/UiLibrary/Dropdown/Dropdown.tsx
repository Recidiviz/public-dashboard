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

import React from "react";
import { useSprings } from "react-spring/web.cjs";
import { Assign } from "utility-types";
import { colors } from "..";
import {
  DropdownBase,
  DropdownCommonProps,
  DropdownMenuItem,
  DropdownMenuItemContents,
  DropdownOption,
} from "./common";

const Dropdown: React.FC<Assign<
  DropdownCommonProps,
  {
    options: (DropdownOption & { hidden?: boolean })[];
    onChange: (id: string) => void;
    selectedId: string;
  }
>> = ({ selectedId, onChange, options, disabled, ...passThruProps }) => {
  const visibleOptions = options.filter(({ hidden }) => !hidden);

  const selectedItem = options.find(({ id }) => id === selectedId);

  // animate menu item highlight states
  const [menuItemsStyles, setMenuItemsStyles] = useSprings(
    options.length,
    () => ({
      background: colors.buttonBackground,
    })
  );

  return (
    <DropdownBase
      {...passThruProps}
      disabled={disabled}
      buttonContents={selectedItem?.label}
      options={visibleOptions}
      renderOption={({ option, index, getItemProps }) => (
        <DropdownMenuItem
          key={option.id}
          {...getItemProps({ item: option, index, disabled })}
        >
          <DropdownMenuItemContents style={menuItemsStyles[index]}>
            {option.label}
          </DropdownMenuItemContents>
        </DropdownMenuItem>
      )}
      selectProps={{
        selectedItem,
        onSelectedItemChange: ({ selectedItem: newSelection }) => {
          if (newSelection) {
            onChange(newSelection.id);
          }
        },
        onHighlightedIndexChange: ({ highlightedIndex }) => {
          // @ts-expect-error error in type defs: https://github.com/pmndrs/react-spring/issues/883
          setMenuItemsStyles((index) => ({
            background:
              index === highlightedIndex
                ? colors.buttonBackgroundHover
                : colors.buttonBackground,
          }));
        },
      }}
    />
  );
};

export default Dropdown;
