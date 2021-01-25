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
import { Spring } from "react-spring/renderprops.cjs";
import styled from "styled-components/macro";
import { colors } from "../colors";
import zIndex from "../zIndex";

const BUTTON_HEIGHT = 40;

const DropdownContainer = styled.div`
  position: relative;
  z-index: ${zIndex.menu};
`;

const DropdownLabel = styled.label`
  display: none;
`;

const DropdownButton = styled.button`
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

const DropdownMenuWrapper = styled.div`
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

const DropdownMenuItemContents = styled.div`
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
}> = ({ disabled, selectedId, label, onChange, options }) => {
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
    onIsOpenChange: () => setWaitForCloseAnimation(true),
  });

  const [buttonHover, setButtonHover] = useState(false);
  const [waitForCloseAnimation, setWaitForCloseAnimation] = useState(false);

  const showMenuItems = isOpen || waitForCloseAnimation;

  return (
    <DropdownContainer>
      <DropdownLabel {...getLabelProps()}>{label}</DropdownLabel>
      <Spring
        from={{ background: colors.buttonBackground }}
        to={{
          background: buttonHover
            ? colors.buttonBackgroundHover
            : colors.buttonBackground,
        }}
      >
        {(buttonStyles) => (
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
        )}
      </Spring>
      <Spring
        from={{
          height: 0,
        }}
        to={{
          height: isOpen ? "auto" : 0,
        }}
        config={{ tension: 210, friction: 20, clamp: true }}
        onRest={(props) => {
          if (props.height === "0") setWaitForCloseAnimation(false);
        }}
      >
        {(menuStyles) => (
          <DropdownMenuWrapper style={menuStyles}>
            <DropdownMenu {...getMenuProps()}>
              {showMenuItems &&
                options.map((option, index) => (
                  <Spring
                    key={option.id}
                    from={{ background: colors.buttonBackground }}
                    to={{
                      background:
                        highlightedIndex === index
                          ? colors.buttonBackgroundHover
                          : colors.buttonBackground,
                    }}
                  >
                    {(itemStyles) => (
                      <DropdownMenuItem
                        {...getItemProps({ item: option, index, disabled })}
                      >
                        <DropdownMenuItemContents style={itemStyles}>
                          {option.label}
                        </DropdownMenuItemContents>
                      </DropdownMenuItem>
                    )}
                  </Spring>
                ))}
            </DropdownMenu>
          </DropdownMenuWrapper>
        )}
      </Spring>
    </DropdownContainer>
  );
};

export default Dropdown;
