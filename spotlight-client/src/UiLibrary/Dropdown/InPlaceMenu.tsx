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
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import colors from "../colors";
import { BUTTON_HEIGHT } from "./common";
import { MenuProps } from "./types";

const InPlaceMenuWrapper = styled(animated.div)`
  overflow: hidden;
  position: absolute;
  right: 0;
  top: ${rem(BUTTON_HEIGHT + 1)};
`;

const InPlaceOptionList = styled.ul`
  ${typography.Sans14}
  background: ${colors.buttonBackground};
  border: 1px solid ${colors.rule};
  border-radius: ${rem(BUTTON_HEIGHT / 4)};
  max-height: 70vh;
  white-space: nowrap;

  &:focus {
    outline: none;
  }
`;

const InPlaceMenu = ({
  getItemProps,
  getMenuProps,
  highlightedIndex,
  isOpen,
  options,
  renderOption,
  setWaitForCloseAnimation,
  waitForCloseAnimation,
}: MenuProps): React.ReactElement => {
  const [menuHeight, setMenuHeight] = useState(0);
  const [listOverflow, setListOverflow] = useState("visible");

  const showMenuItems = isOpen || waitForCloseAnimation;
  const wrapperStyles = useSpring({
    from: { height: 0 },
    height: isOpen ? menuHeight : 0,
    config: { clamp: true, friction: 20, tension: 210 },
    onRest: (props) => {
      if (props.height === 0) {
        setWaitForCloseAnimation(false);
        setListOverflow("visible");
      } else {
        // updated at the end of the animation because it will
        // interfere with menu expansion if it's already set
        setListOverflow("auto");
      }
    },
  });

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
        <InPlaceMenuWrapper style={wrapperStyles}>
          <InPlaceOptionList
            {...getMenuProps({ ref: measureRef })}
            style={{ overflow: listOverflow }}
          >
            {showMenuItems &&
              options.map((option, index) =>
                renderOption({
                  getItemProps,
                  highlightedIndex,
                  index,
                  option,
                })
              )}
          </InPlaceOptionList>
        </InPlaceMenuWrapper>
      )}
    </Measure>
  );
};

export default InPlaceMenu;
