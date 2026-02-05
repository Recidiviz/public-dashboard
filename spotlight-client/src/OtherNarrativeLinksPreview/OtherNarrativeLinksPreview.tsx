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

import {
  Tabs,
  TabList as BasicTabList,
  Tab,
  TabPanel as BasicTabPanel,
  typography,
} from "@recidiviz/design-system";
import { ascending } from "d3-array";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { DEFAULT_SELECTED_TAB, DEFAULT_CAROUSEL_INTERVAL } from "../constants";
import { NarrativeTypeId } from "../contentApi/types";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import SystemNarrative from "../contentModels/SystemNarrative";
import { Narrative } from "../contentModels/types";
import MetricVizMapper from "../MetricVizMapper";
import ModelHydrator from "../ModelHydrator";
import BarChartPair from "../charts/BarChartPair";
import { useDataStore } from "../StoreProvider";
import { breakpoints, colors, fluidFontSizeStyles } from "../UiLibrary";

// grid styles adapted from IE-safe auto placement grid
// https://css-tricks.com/css-grid-in-ie-faking-an-auto-placement-grid-with-gaps/

const Wrapper = styled.div`
  /* prevents the trailing grid gaps from pushing other stuff around */
  @media (max-width: ${breakpoints.tablet[0]}px) {
    overflow: hidden;
  }
`;

const ChartTitle = styled.div`
  ${typography.Sans16}
  margin-top: ${rem(16)};
`;

const ChartPreview = styled.div`
  margin-top: ${rem(16)};
  height: ${rem(440)};
  animation: fadeIn 0.5s ease;

  @media screen and (max-width: ${breakpoints.tablet[0]}px) {
    height: ${rem(330)};
    overflow: hidden;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const TabList = styled(BasicTabList)`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0;
  overflow-x: auto;
`;

const TabItem = styled(Tab)<{ minSize: number; maxSize: number }>`
  padding: ${rem(25)} 0;
  color: ${colors.caption};
  border-bottom: 1px solid transparent;
  font-family: "Libre Baskerville";
  font-style: normal;
  font-weight: 400;

  &:first-child {
    margin-left: 0;
  }

  ${(props) => fluidFontSizeStyles(props.minSize, props.maxSize)}
`;

const TabPanel = styled(BasicTabPanel)`
  padding: 0;
`;

const PREVIEW_ORDER: NarrativeTypeId[] = [
  "Prison",
  "RacialDisparities",
  "Probation",
  "Parole",
  "Sentencing",
];

const ChartPreviewComponent: React.FC<{
  narrative: Narrative;
}> = ({ narrative }) => {
  if (narrative instanceof SystemNarrative && narrative.preview)
    return (
      <>
        <ChartPreview>
          <MetricVizMapper
            preview
            metric={
              narrative.sections.find(
                (section) => section.metric.id === narrative.preview
              )?.metric
            }
          />
        </ChartPreview>
        <ChartTitle>{narrative.previewTitle}</ChartTitle>
      </>
    );
  if (narrative instanceof RacialDisparitiesNarrative) {
    return <RacialDisparitiesPreview narrative={narrative} />;
  }
  return null;
};

const RacialDisparitiesPreview = observer(
  ({ narrative }: { narrative: RacialDisparitiesNarrative }): JSX.Element => {
    return (
      <ModelHydrator model={narrative}>
        <>
          {narrative.populationDataSeries && (
            <ChartPreview>
              <BarChartPair data={narrative.populationDataSeries} preview />
            </ChartPreview>
          )}
          <ChartTitle>
            Population by {narrative.raceOrEthnicityLabel}
          </ChartTitle>
        </>
      </ModelHydrator>
    );
  }
);

const NarrativeTabs: React.FC<{
  narratives: Narrative[];
  onTabChange: (selectedTab: NarrativeTypeId) => void;
}> = observer(({ narratives, onTabChange }) => {
  const tabs = narratives.map((narrative) => narrative.id);
  const defaultTab = tabs.includes(DEFAULT_SELECTED_TAB)
    ? DEFAULT_SELECTED_TAB
    : tabs[0];

  const [selectedTab, selectTab] = React.useState<NarrativeTypeId>(defaultTab);
  const [tabIndex, setTabIndex] = React.useState(tabs.indexOf(defaultTab));
  const [isHovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const nextIndex = (tabIndex + 1) % tabs.length;

    const timer = setTimeout(
      () => {
        setTabIndex(nextIndex);
        selectTab(tabs[nextIndex]);
      },
      isHovered ? DEFAULT_CAROUSEL_INTERVAL * 1000 : DEFAULT_CAROUSEL_INTERVAL
    );

    onTabChange(selectedTab);

    return () => clearTimeout(timer);
  }, [tabIndex, selectedTab, onTabChange, tabs, isHovered]);

  return (
    <Tabs
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
      onMouseOver={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onBlur={() => setHovered(false)}
    >
      <TabList>
        {narratives.map((narrative) => (
          <TabItem
            key={narrative.id}
            maxSize={24}
            minSize={16}
            onClick={() => selectTab(narrative.id)}
          >
            {narrative.title}
          </TabItem>
        ))}
      </TabList>
      {narratives.map((narrative) => (
        <TabPanel key={narrative.id}>
          <ChartPreviewComponent narrative={narrative} />
        </TabPanel>
      ))}
    </Tabs>
  );
});

/**
 * Produces a grid of links to available narratives for the current tenant.
 * If there is a current narrative selected, it will be excluded from the grid.
 */
const OtherNarrativeLinksPreview: React.FC<{
  onTabChange: (selectedTab: NarrativeTypeId) => void;
}> = ({ onTabChange }): React.ReactElement | null => {
  const { tenant } = useDataStore();

  if (!tenant) return null;

  const narrativesToDisplay = [
    ...Object.values(tenant.systemNarratives),
    tenant.racialDisparitiesNarrative,
  ]
    .filter((n): n is Narrative => Boolean(n))
    .sort((a, b) =>
      ascending(PREVIEW_ORDER.indexOf(a.id), PREVIEW_ORDER.indexOf(b.id))
    )
    .slice(0, 4);

  return (
    <Wrapper>
      <NarrativeTabs
        narratives={narrativesToDisplay}
        onTabChange={onTabChange}
      />
    </Wrapper>
  );
};

export default observer(OtherNarrativeLinksPreview);
