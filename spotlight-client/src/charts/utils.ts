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

import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import sumBy from "lodash/sumBy";
import { useCallback, useState } from "react";
import { STATISTIC_THRESHOLD } from "../constants";
import { colors } from "../UiLibrary";
import { isItemToHighlight, ItemToHighlight } from "./types";

const FADE_AMOUNT = 0.45;

export function isSmallData(data: { value: number }[]): boolean {
  const totalNumber = sumBy(data, ({ value }) => value);
  return totalNumber < STATISTIC_THRESHOLD;
}

export function highlightFade(
  baseColor: string,
  { useOpacity = false } = {}
): string {
  if (useOpacity) {
    // in cases where we actually want the color to be transparent,
    // this is a relatively straightforward opacity change
    const fadedColor = color(baseColor);

    // can't do anything with an invalid color
    if (!fadedColor) return baseColor;

    fadedColor.opacity = FADE_AMOUNT;
    return fadedColor.toString();
  }
  // in cases where we don't want a transparent color (which is most cases),
  // this will create a tint ramp from background color to baseColor;
  // the ramp goes from 0 to 1 with values analogous to opacity
  return interpolateRgb(colors.background, baseColor)(FADE_AMOUNT);
}

export function useHighlightedItem(
  initialValue?: ItemToHighlight
): {
  // object instead of tuple because the TS tuple syntax is unsupported
  // in our version of react-scripts
  // https://github.com/facebook/create-react-app/issues/9515
  highlighted: ItemToHighlight | undefined;
  setHighlighted: (arg?: Record<string, unknown>) => void;
} {
  const [highlighted, setHighlighted] = useState<ItemToHighlight | undefined>(
    initialValue
  );
  const setHighlightedWithTypeCheck = useCallback(
    (arg) => {
      if (isItemToHighlight(arg) || typeof arg === "undefined") {
        setHighlighted(arg);
      } else {
        throw new Error("unexpected data type; cannot highlight");
      }
    },
    [setHighlighted]
  );

  return { highlighted, setHighlighted: setHighlightedWithTypeCheck };
}
