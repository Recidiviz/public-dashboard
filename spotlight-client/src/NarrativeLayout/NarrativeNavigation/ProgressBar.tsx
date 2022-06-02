// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components/macro";
import { rem } from "polished";
import { FOOTER_HEIGHT, PROGRESS_BAR_HEIGHT } from "../../constants";
import { colors } from "../../UiLibrary";

const Container = styled.div`
  background: ${colors.checkbox};
  height: ${rem(PROGRESS_BAR_HEIGHT)};
  width: 100%;
`;

const Bar = styled.div<{ scrolled: number }>`
  background: ${colors.link};
  height: ${rem(PROGRESS_BAR_HEIGHT)};
  max-width: 100%;
  width: ${(props) => props.scrolled}%;
`;

const ProgressBar: React.FC<{
  onScroll: (scrolled: number) => void;
}> = ({ onScroll }) => {
  const [scrolledPercent, setScrolled] = useState(0);

  const scrollProgress = useCallback(() => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight -
      FOOTER_HEIGHT;
    const scrolled = (scrollPx / winHeightPx) * 100;
    setScrolled(scrolled);
    onScroll(scrolled);
  }, [onScroll]);

  useEffect(() => {
    window.addEventListener("scroll", scrollProgress);

    return () => {
      window.removeEventListener("scroll", scrollProgress);
    };
  });

  return (
    <Container>
      <Bar scrolled={scrolledPercent} />
    </Container>
  );
};

export default ProgressBar;
