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
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring, useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { Assign } from "utility-types";
import { colors } from "..";
import { highlightFade } from "../../charts/utils";
import Check from "../Check";
import zIndex from "../zIndex";

const BUTTON_HEIGHT = 40;
const SELECT_ALL_ID = "__ALL__";

const DropdownContainer = styled.div`
  position: relative;
  z-index: ${zIndex.menu};
`;

const DropdownLabel = styled.label`
  display: none;
`;

const DropdownButton = styled(animated.button)`
  align-items: center;
  border: 1px solid ${colors.rule};
  border-radius: ${rem(BUTTON_HEIGHT / 2)};
  cursor: pointer;
  display: flex;
  height: ${rem(BUTTON_HEIGHT)};
  font-size: ${rem(13)};
  padding: 0 ${rem(16)};
  z-index: ${zIndex.control};

  &:focus {
    outline: none;
  }

  &::after {
    border-left: ${rem(4)} solid transparent;
    border-right: ${rem(4)} solid transparent;
    border-top: ${rem(4)} solid currentColor;
    content: "";
    height: 0;
    margin-left: ${rem(16)};
    width: 0;
  }
`;

const DropdownMenuWrapper = styled(animated.div)`
  overflow: hidden;
  position: absolute;
  right: 0;
  top: ${rem(BUTTON_HEIGHT + 1)};
`;

const DropdownMenu = styled.ul`
  background: ${colors.buttonBackground};
  border: 1px solid ${colors.rule};
  border-radius: ${rem(BUTTON_HEIGHT / 4)};
  font-size: ${rem(13)};
  white-space: nowrap;

  &:focus {
    outline: none;
  }
`;

const DropdownMenuItem = styled.li`
  cursor: pointer;

  &:first-child {
    margin-top: ${rem(8)};
  }

  &:last-child {
    margin-bottom: ${rem(8)};
  }
`;

const DropdownMenuItemContents = styled(animated.div)`
  display: flex;
  justify-content: space-between;
  padding: ${rem(8)} ${rem(16)};
`;

const CheckMarkWrapper = styled.span`
  display: inline-block;
  margin-left: ${rem(32)};
`;

type DropdownOption = {
  id: string;
  label: string;
  hidden?: boolean;
  color?: string;
};

type SingleSelectProps = {
  disabled?: boolean;
  label: string;
  onChange: (id: string) => void;
  onChangeMultiple?: never;
  onHighlight?: (id?: string) => void;
  options: DropdownOption[];
  selectedId: string;
  multiple?: never;
};

type MultipleSelectProps = Assign<
  SingleSelectProps,
  {
    multiple: true;
    onChange?: never;
    onChangeMultiple: (ids: string[]) => void;
    selectedId: string[];
  }
>;

function Dropdown(props: SingleSelectProps): React.ReactElement | null;
function Dropdown(props: MultipleSelectProps): React.ReactElement | null;
function Dropdown({
  disabled,
  selectedId,
  label,
  onChange,
  onChangeMultiple,
  onHighlight,
  options: providedOptions,
  multiple,
}: SingleSelectProps | MultipleSelectProps): React.ReactElement | null {
  const visibleProvidedOptions = providedOptions.filter(
    ({ hidden }) => !hidden
  );

  const multipleSelectOptions: DropdownOption[] = [];

  if (multiple) {
    multipleSelectOptions.push({
      id: SELECT_ALL_ID,
      label:
        visibleProvidedOptions.length === selectedId.length
          ? "Deselect all"
          : "Select all",
    });
  }

  const visibleOptions = [...multipleSelectOptions, ...visibleProvidedOptions];

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: multiple
      ? null
      : providedOptions.find(({ id }) => id === selectedId),
    items: visibleOptions,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (multiple) {
            // preserve menu state for additional selections
            changes.isOpen = true;
            changes.highlightedIndex = state.highlightedIndex;
          }
          return changes;
        default:
          return changes;
      }
    },
    onSelectedItemChange: ({ selectedItem: newSelection }) => {
      if (newSelection) {
        if (onChangeMultiple) {
          if (newSelection.id === SELECT_ALL_ID) {
            // if all are already selected, deselect all
            if (selectedId.length === visibleProvidedOptions.length) {
              onChangeMultiple([]);
            } else {
              onChangeMultiple(visibleProvidedOptions.map(({ id }) => id));
            }
          } else {
            onChangeMultiple(xor(selectedId, [newSelection.id]));
          }
        } else if (onChange) {
          onChange(newSelection.id);
        }
      }
    },
    onIsOpenChange: () => setWaitForCloseAnimation(true),
    onHighlightedIndexChange: ({ highlightedIndex: newHighlightedIndex }) => {
      if (onHighlight) {
        const highlightedId =
          newHighlightedIndex !== undefined
            ? visibleOptions[newHighlightedIndex]?.id
            : undefined;
        if (highlightedId !== SELECT_ALL_ID) onHighlight(highlightedId);
      }
    },
  });

  // animate button hover state
  const [buttonHover, setButtonHover] = useState(false);
  const buttonStyles = useSpring({
    from: { background: colors.buttonBackground },
    background:
      buttonHover && !disabled
        ? colors.buttonBackgroundHover
        : colors.buttonBackground,
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? colors.textDisabled : colors.text,
  });

  // animate menu opening and closing
  const [waitForCloseAnimation, setWaitForCloseAnimation] = useState(false);
  const showMenuItems = isOpen || waitForCloseAnimation;
  const [menuHeight, setMenuHeight] = useState(0);
  const menuStyles = useSpring({
    from: { height: 0 },
    height: isOpen ? menuHeight : 0,
    config: { clamp: true, friction: 20, tension: 210 },
    onRest: (props) => {
      if (props.height === 0) setWaitForCloseAnimation(false);
    },
  });

  // animate menu item highlight states
  const menuItemsStyles = useSprings(
    visibleOptions.length,
    visibleOptions.map((option, index) => {
      let background =
        highlightedIndex === index
          ? colors.buttonBackgroundHover
          : colors.buttonBackground;
      let color = colors.text;

      // multiple select can be color-coded; lots of conditions:
      // - use color to indicate selected and highlighted
      // - use faded color to indicate selected when another is highlighted
      // - use default menu color if neither selected nor highlighted
      if (multiple && option.color) {
        if (highlightedIndex === index) {
          background = option.color;
          color = colors.textLight;
        } else if (selectedId.includes(option.id)) {
          background =
            highlightedIndex === -1
              ? option.color
              : highlightFade(option.color);
          color = colors.textLight;
        } else {
          background = colors.buttonBackground;
        }
      }

      return { background, color };
    })
  );

  // button contents differ for single vs multiple select
  let buttonContents: React.ReactNode;

  if (typeof selectedId === "string") {
    buttonContents = selectedItem?.label;
  } else {
    const firstSelected = providedOptions.find(
      ({ id }) => id === selectedId[0]
    );
    buttonContents = (
      <>
        {!firstSelected && "Select …"}
        {firstSelected && firstSelected.label}
        {selectedId.length > 1 && (
          <em>
            &nbsp;and {selectedId.length - 1} other
            {selectedId.length > 2 ? "s" : ""}
          </em>
        )}
      </>
    );
  }

  return (
    <Measure
      bounds
      onResize={({ bounds }) => {
        if (bounds && bounds.height !== menuHeight) {
          setMenuHeight(bounds.height);
        }
      }}
    >
      {({ measureRef }) => (
        <DropdownContainer>
          <DropdownLabel {...getLabelProps()}>{label}</DropdownLabel>
          <DropdownButton
            type="button"
            {...getToggleButtonProps({ disabled })}
            style={buttonStyles}
            onMouseOver={() => setButtonHover(true)}
            onFocus={() => setButtonHover(true)}
            onMouseOut={() => setButtonHover(false)}
            onBlur={() => setButtonHover(false)}
          >
            {buttonContents}
          </DropdownButton>

          <DropdownMenuWrapper style={menuStyles}>
            <DropdownMenu {...getMenuProps({ ref: measureRef })}>
              {showMenuItems &&
                visibleOptions.map((option, index) => {
                  const itemProps = getItemProps({
                    item: option,
                    index,
                    disabled,
                  });

                  const isMultipleSelected = Boolean(
                    multiple && selectedId.includes(option.id)
                  );

                  // Downshift doesn't compute multiple selection but we can override
                  if (isMultipleSelected) {
                    itemProps["aria-selected"] = true;
                  }

                  return (
                    <DropdownMenuItem key={option.id} {...itemProps}>
                      <DropdownMenuItemContents style={menuItemsStyles[index]}>
                        {option.label}
                        {multiple && index > 0 && (
                          <CheckMarkWrapper>
                            <Check visible={isMultipleSelected} />
                          </CheckMarkWrapper>
                        )}
                      </DropdownMenuItemContents>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenu>
          </DropdownMenuWrapper>
        </DropdownContainer>
      )}
    </Measure>
  );
}

export default Dropdown;
