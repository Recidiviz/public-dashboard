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

import { Icon, IconSVG } from "@recidiviz/design-system";
import React, { useState, useEffect } from "react";
import { track } from "../../analytics";
import { SectionNavProps } from "./types";
import { Button } from "./Wayfinder";

type AdvanceLinkProps = SectionNavProps & {
  disabled: boolean;
  type: "previous" | "next";
  flashing?: boolean;
};

const AdvanceLink: React.FC<AdvanceLinkProps> = ({
  activeSection,
  disabled,
  goToSection,
  type,
  flashing,
}) => {
  const [isFlashing, setFlashing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlashing(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      setFlashing(false);
    };
  }, [activeSection]);

  let targetSection: number;
  let rotate: 0 | 180;

  if (type === "previous") {
    targetSection = activeSection - 1;
    rotate = 180;
  } else {
    targetSection = activeSection + 1;
    rotate = 0;
  }

  return (
    <Button
      rounded
      kind="borderless"
      active={!disabled && flashing && isFlashing}
      flashing={!disabled && flashing && isFlashing}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          track(`advance_section_link_clicked`, {
            category: "navigation",
            label: type,
          });
          goToSection(targetSection);
        }
      }}
      aria-label={`${type} section`}
    >
      <Icon
        kind={IconSVG.Arrow}
        width={20}
        rotate={rotate}
        style={{ rotate: `${rotate}deg` }}
      />
    </Button>
  );
};
export default AdvanceLink;
