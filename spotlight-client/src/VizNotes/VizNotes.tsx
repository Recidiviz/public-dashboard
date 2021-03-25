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

import { format } from "date-fns";
import React from "react";
import { ValuesType } from "utility-types";
import { UnknownCounts, Unknowns } from "../contentModels/types";
import { getDemographicViewLabel } from "../demographics";
import { DemographicFieldKeyList } from "../metricsApi";
import Notes from "../Notes";
import { formatAsNumber } from "../utils";

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

function formatUnknowns(unknowns: Unknowns) {
  if (Array.isArray(unknowns)) {
    // Typescript freaks out over unions of array types,
    // but this assertion is functionally identical
    return (unknowns as ValuesType<typeof unknowns>[])
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
  }
  return formatUnknownCounts(unknowns);
}

type VizNotesProps = {
  smallData?: boolean;
  unknowns?: Unknowns;
};

const VizNotes: React.FC<VizNotesProps> = ({ smallData, unknowns }) => {
  return (
    <Notes>
      {smallData && (
        <>
          Please always take note of the number of people associated with each
          proportion presented here; in cases where the counts are especially
          low, the proportion may not be statistically significant and therefore
          not indicative of long-term trends.
        </>
      )}
      {unknowns && (
        <>
          This data includes some individuals for whom age, gender, or
          race/ethnicity is not reported. These individuals count toward the
          total but are excluded from demographic breakdown views. Unknown
          values comprise: {formatUnknowns(unknowns)}.
        </>
      )}
    </Notes>
  );
};

export default VizNotes;
