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
import { rem } from "polished";
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring, useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { colors } from "..";
import zIndex from "../zIndex";

const BUTTON_HEIGHT = 40;

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
  color: ${colors.text};
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
    border-top: ${rem(4)} solid ${colors.text};
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
  padding: ${rem(8)} ${rem(16)};
`;

type DropdownOption = {
  id: string;
  label: string;
  hidden?: boolean;
};

const Dropdown: React.FC<{
  disabled?: boolean;
  label: string;
  onChange: (id: string) => void;
  options: DropdownOption[];
  selectedId: string;
}> = ({ disabled, selectedId, label, onChange, options: allOptions }) => {
  const visibleOptions = allOptions.filter(({ hidden }) => !hidden);
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: allOptions.find(({ id }) => id === selectedId),
    items: visibleOptions,
    onSelectedItemChange: ({ selectedItem: newSelection }) => {
      if (newSelection) {
        onChange(newSelection.id);
      }
    },
    onIsOpenChange: () => setWaitForCloseAnimation(true),
  });

  // animate button hover state
  const [buttonHover, setButtonHover] = useState(false);
  const buttonStyles = useSpring({
    from: { background: colors.buttonBackground },
    background: buttonHover
      ? colors.buttonBackgroundHover
      : colors.buttonBackground,
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
    visibleOptions.map((option, index) => ({
      background:
        highlightedIndex === index
          ? colors.buttonBackgroundHover
          : colors.buttonBackground,
    }))
  );

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
            {selectedItem?.label}
          </DropdownButton>

          <DropdownMenuWrapper style={menuStyles}>
            <DropdownMenu {...getMenuProps({ ref: measureRef })}>
              {showMenuItems &&
                visibleOptions.map((option, index) => (
                  <DropdownMenuItem
                    key={option.id}
                    {...getItemProps({ item: option, index, disabled })}
                  >
                    <DropdownMenuItemContents style={menuItemsStyles[index]}>
                      {option.label}
                    </DropdownMenuItemContents>
                  </DropdownMenuItem>
                ))}
            </DropdownMenu>
          </DropdownMenuWrapper>
        </DropdownContainer>
      )}
    </Measure>
  );
};

export default Dropdown;
