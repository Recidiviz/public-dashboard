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

import useBreakpoint from "@w11r/use-breakpoint";
import { rem } from "polished";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { ItemToHighlight, ProportionalBar } from "../charts";
import { DemographicCategoryRecords } from "../contentModels/types";
import SmallDataDisclaimer from "../SmallDataDisclaimer";
import VizControls, { VizControlsProps } from "../VizControls";

const CHART_HEIGHT = 165;

const CHART_HEIGHT_MOBILE = 100;

const Wrapper = styled.div`
  padding: ${rem(48)} 0;
`;

const Spacer = styled.div`
  height: ${rem(24)};
`;

type BarChartPairProps = {
  data: DemographicCategoryRecords[];
  download: () => void;
  filters: VizControlsProps["filters"];
  methodology: string;
};

export default function BarChartPair({
  data,
  download,
  filters,
  methodology,
}: BarChartPairProps): React.ReactElement {
  const [highlightedCategory, setHighlightedCategory] = useState<
    ItemToHighlight | undefined
  >();

  const chartHeight = useBreakpoint(CHART_HEIGHT, [
    "mobile-",
    CHART_HEIGHT_MOBILE,
  ]);

  return (
    <Wrapper>
      <VizControls
        filters={filters}
        methodology={methodology}
        download={download}
      />
      <ProportionalBar
        data={data[0].records}
        title={data[0].label}
        height={chartHeight}
        highlighted={highlightedCategory}
        showLegend={false}
      />
      <Spacer />
      <ProportionalBar
        data={data[1].records}
        title={data[1].label}
        height={chartHeight}
        highlighted={highlightedCategory}
        setHighlighted={setHighlightedCategory}
      />
      <SmallDataDisclaimer />
    </Wrapper>
  );
}
