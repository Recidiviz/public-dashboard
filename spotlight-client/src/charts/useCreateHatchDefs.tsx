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

import React, { useState, useEffect } from "react";
import { PatternLines } from "@vx/pattern";
import { CategoricalChartRecord, ItemToHighlight } from "./types";
import { highlightFade } from "./utils";
import { STATISTIC_THRESHOLD } from "../constants";

export function useCreateHatchDefs(
  data: CategoricalChartRecord[],
  highlighted: ItemToHighlight | undefined,
  type?: "rate"
): React.ReactNode[] {
  const [hatchDefs, setHatchDefs] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const defs = data.reduce(
      (acc: React.ReactNode[], d: CategoricalChartRecord) => {
        if (d.value < STATISTIC_THRESHOLD) {
          acc.push(
            <PatternLines
              id={d.label.replace(/[^\w\d]/g, "")}
              height={5}
              width={5}
              background={
                highlighted && highlighted.label !== d.label
                  ? highlightFade(d.color)
                  : d.color
              }
              stroke="white"
              strokeWidth={0.5}
              orientation={["diagonal"]}
            />
          );
        }
        return acc;
      },
      []
    );

    setHatchDefs(defs);
  }, [data, highlighted, type]);

  return hatchDefs;
}
