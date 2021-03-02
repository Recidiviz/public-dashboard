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

import useBreakpoint from "@w11r/use-breakpoint";
import { useSelect, UseSelectProps } from "downshift";
import { rem } from "polished";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { colors } from "..";
import zIndex from "../zIndex";
import { BUTTON_HEIGHT } from "./common";
import FixedMenu from "./FixedMenu";
import InPlaceMenu from "./InPlaceMenu";
import { DropdownCommonProps, DropdownOption, RenderOption } from "./types";

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

const DropdownBase: React.FC<
  DropdownCommonProps & {
    buttonContents: React.ReactNode;
    renderOption: RenderOption;
    selectProps: Partial<UseSelectProps<DropdownOption>>;
  }
> = ({
  buttonContents,
  disabled,
  label,
  options,
  renderOption,
  selectProps,
}) => {
  // helper for animation of menu opening and closing
  const [waitForCloseAnimation, setWaitForCloseAnimation] = useState(false);

  const {
    closeMenu,
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: options,
    onIsOpenChange: () => setWaitForCloseAnimation(true),
    ...selectProps,
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

  const useFixedMenu = useBreakpoint(false, ["mobile-", true]);

  const menuProps = {
    closeMenu,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    label,
    options,
    renderOption,
    setWaitForCloseAnimation,
    waitForCloseAnimation,
  };

  return (
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
      {useFixedMenu ? (
        <FixedMenu {...menuProps} />
      ) : (
        <InPlaceMenu {...menuProps} />
      )}
    </DropdownContainer>
  );
};

export default DropdownBase;
