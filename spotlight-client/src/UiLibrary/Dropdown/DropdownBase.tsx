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

import { typography } from "@recidiviz/design-system";
import useBreakpoint from "@w11r/use-breakpoint";
import { useSelect, UseSelectProps } from "downshift";
import { rem } from "polished";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled, { css } from "styled-components/macro";
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

const linkButtonKindStyles = css`
  ${typography.Sans16}
  border: none;
  padding: 0 0;
`;

const defaultButtonKindStyles = css`
  ${typography.Sans14}
  border: 1px solid ${colors.rule};
  padding: 0 ${rem(16)};
`;

const DropdownButton = styled(animated.button)<{
  kind: DropdownCommonProps["buttonKind"];
}>`
  align-items: center;
  background: ${colors.buttonBackground};
  border-radius: ${rem(BUTTON_HEIGHT / 2)};
  color: ${colors.text};
  cursor: pointer;
  display: flex;
  height: ${rem(BUTTON_HEIGHT)};
  z-index: ${zIndex.control};

  ${(props) =>
    props.kind === "link" ? linkButtonKindStyles : defaultButtonKindStyles}

  &:focus {
    outline: none;
  }
`;

const DropdownButtonCaret = styled.span`
  border-left: ${rem(4)} solid transparent;
  border-right: ${rem(4)} solid transparent;
  border-top: ${rem(4)} solid currentColor;
  content: "";
  height: 0;
  margin-left: ${rem(16)};
  width: 0;
`;

const DropdownBase: React.FC<
  DropdownCommonProps & {
    buttonContents: React.ReactNode;
    renderOption: RenderOption;
    selectProps: Partial<UseSelectProps<DropdownOption>>;
  }
> = ({
  buttonContents,
  buttonKind,
  disabled,
  label,
  options,
  renderOption,
  selectProps,
}) => {
  // helper for animation of menu opening and closing
  const [waitForCloseAnimation, setWaitForCloseAnimation] = useState(false);

  const { selectedItem, ...passThruSelectProps } = selectProps;

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
    // passing null explicitly clears the selection; without it,
    // Downshift maintains an internal selection state that we don't want.
    // The dropdown is either fully controlled by an input prop or it is stateless
    selectedItem: selectedItem || null,
    ...passThruSelectProps,
  });

  // animate button hover state
  const [buttonHover, setButtonHover] = useState(false);
  let buttonBackground: string;
  let buttonColor: string;
  if (buttonKind === "link") {
    buttonBackground = "transparent";
    buttonColor = buttonHover ? colors.link : colors.text;
  } else {
    buttonBackground =
      buttonHover && !disabled
        ? colors.buttonBackgroundHover
        : colors.buttonBackground;
    buttonColor = colors.text;
  }
  const buttonStyles = useSpring({
    background: buttonBackground,
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? colors.textDisabled : buttonColor,
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
        kind={buttonKind}
        {...getToggleButtonProps({ disabled })}
        style={buttonStyles}
        onMouseOver={() => setButtonHover(true)}
        onFocus={() => setButtonHover(true)}
        onMouseOut={() => setButtonHover(false)}
        onBlur={() => setButtonHover(false)}
      >
        {buttonContents || <span aria-hidden>{label}</span>}
        <DropdownButtonCaret />
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
