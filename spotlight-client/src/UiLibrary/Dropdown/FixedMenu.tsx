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
import { rem } from "polished";
import React from "react";
import { Portal } from "react-portal";
import { useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { colors } from "..";
import FixedBottomPanel from "../FixedBottomPanel";
import { OptionItemContents } from "./common";
import { MenuProps } from "./types";

const FixedMenuLabel = styled.div`
  ${typography.Serif24}
  align-self: center;
  color: ${colors.caption};
  margin: ${rem(24)} 0;
`;

const FixedOptionList = styled.ul`
  color: ${colors.textLight};
  font-size: ${rem(18)};
  overflow: auto;
  text-align: center;
  width: 100%;

  &:focus {
    outline: none;
  }

  ${OptionItemContents} {
    padding: ${rem(16)};
  }
`;

const FixedMenu = ({
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
}: MenuProps): React.ReactElement => {
  const showMenuItems = isOpen || waitForCloseAnimation;

  const menuStyles = useSpring({
    from: { top: "100%" },
    top: isOpen ? "25%" : "100%",
    config: { clamp: true, friction: 20, tension: 210 },
    onRest: (props) => {
      if (props.top === "100%") setWaitForCloseAnimation(false);
    },
  });

  return (
    <Portal>
      <FixedBottomPanel
        closePanel={() => closeMenu()}
        isOpen={showMenuItems}
        top={menuStyles.top}
      >
        <>
          <FixedMenuLabel>Choose {label}</FixedMenuLabel>
          <FixedOptionList {...getMenuProps()}>
            {showMenuItems &&
              options.map((option, index) =>
                renderOption({
                  getItemProps,
                  highlightedIndex,
                  index,
                  option,
                })
              )}
          </FixedOptionList>
        </>
      </FixedBottomPanel>
    </Portal>
  );
};

export default FixedMenu;
