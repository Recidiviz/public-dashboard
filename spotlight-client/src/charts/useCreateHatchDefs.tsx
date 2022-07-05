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

import React, { useCallback } from "react";
import { PatternLines } from "@vx/pattern";
import { CommonDataPoint } from "./types";
import { highlightFade } from "./utils";

export function useCreateHatchDefs(): {
  getHatchDefs: (data: CommonDataPoint[], hlabel?: string) => React.ReactNode;
  generateHatchFill: (label: string, highlightedLabel?: string) => string;
} {
  const getHatchDefs = useCallback((data) => {
    return data.flatMap((d: CommonDataPoint) => [
      <PatternLines
        id={d.label.replace(/[^\w\d]/g, "")}
        height={5}
        width={5}
        background={d.color}
        stroke="white"
        strokeWidth={0.5}
        orientation={["diagonal"]}
      />,
      <PatternLines
        id={`${d.label.replace(/[^\w\d]/g, "")}_highlighted`}
        height={5}
        width={5}
        background={highlightFade(d.color)}
        stroke="white"
        strokeWidth={0.5}
        orientation={["diagonal"]}
      />,
    ]);
  }, []);

  const generateHatchFill = useCallback((label, highlightedLabel) => {
    const id =
      highlightedLabel && highlightedLabel !== label
        ? `${label.replace(/[^\w\d]/g, "")}_highlighted`
        : label.replace(/[^\w\d]/g, "");

    return `url(#${id})`;
  }, []);

  return { getHatchDefs, generateHatchFill };
}
