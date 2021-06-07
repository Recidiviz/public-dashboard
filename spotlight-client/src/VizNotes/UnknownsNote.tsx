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

import { Button } from "@recidiviz/design-system";
import { format } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { ValuesType } from "utility-types";
import { UnknownCounts, Unknowns } from "../contentModels/types";
import { getDemographicViewLabel } from "../demographics";
import { DemographicFieldKeyList } from "../metricsApi";
import { AutoHeightTransition } from "../UiLibrary";
import { formatAsNumber } from "../utils";

const COLLAPSED_LIMIT = 3;

const ExpandNoteButton = styled(Button).attrs({ kind: "link" })`
  font-size: inherit;
  font-weight: inherit;
`;

function formatUnknownCounts(unknowns: UnknownCounts) {
  const parts: string[] = [];

  DemographicFieldKeyList.forEach((key) => {
    const value = unknowns[key];
    if (!value) return;

    parts.push(
      `${getDemographicViewLabel(key).toLowerCase()} (${formatAsNumber(value)})`
    );
  });

  return parts.join(", ");
}

function useFormattedUnknowns(unknowns: Unknowns) {
  // if the list is short this will have no effect; if it's long we want to start collapsed
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (Array.isArray(unknowns)) {
    const isCollapsible = unknowns.length > COLLAPSED_LIMIT;

    // Typescript freaks out over unions of array types,
    // but this assertion is functionally identical
    let unknownsToShow = unknowns as ValuesType<typeof unknowns>[];
    let overflowCount = 0;

    if (isCollapsed) {
      unknownsToShow = unknownsToShow.slice(0, COLLAPSED_LIMIT);
      overflowCount = unknowns.length - unknownsToShow.length;
    }

    const formattedUnknowns = unknownsToShow
      .map((entry) => {
        const formattedCounts = formatUnknownCounts(entry.unknowns);
        let label: string;

        if ("date" in entry) {
          label = format(entry.date, "MMM d y");
        } else {
          label = `the ${entry.cohort} cohort`;
        }

        return `${formattedCounts} for ${label}`;
      })
      .join("; ");

    return (
      <>
        {formattedUnknowns}
        {isCollapsible && (
          <>
            {isCollapsed ? "; " : " "}
            <ExpandNoteButton onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed
                ? ` + ${overflowCount} more`
                : "(Hide extended list)"}
            </ExpandNoteButton>
          </>
        )}
      </>
    );
  }

  return formatUnknownCounts(unknowns);
}

type UnknownsNoteProps = {
  unknowns: Unknowns;
};

export const UnknownsNote = ({ unknowns }: UnknownsNoteProps): JSX.Element => {
  return (
    <AutoHeightTransition>
      This data includes some individuals for whom age, gender, or
      race/ethnicity is not reported. These individuals count toward the total
      but are excluded from demographic breakdown views. Unknown values
      comprise: {useFormattedUnknowns(unknowns)}.
    </AutoHeightTransition>
  );
};
