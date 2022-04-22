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
  Button as BasicButton,
  Tabs,
  TabList as BasicTabList,
  Tab,
  TabPanel as BasicTabPanel,
} from "@recidiviz/design-system";
import { Link } from "@reach/router";
import { ascending } from "d3-array";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { track } from "../analytics";
import { NarrativeTypeId, TenantId } from "../contentApi/types";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import SystemNarrative from "../contentModels/SystemNarrative";
import { Narrative } from "../contentModels/types";
import MetricVizMapper from "../MetricVizMapper";
import ModelHydrator from "../ModelHydrator";
import BarChartPair from "../RacialDisparitiesNarrativePage/BarChartPair";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { breakpoints, colors } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";

// grid styles adapted from IE-safe auto placement grid
// https://css-tricks.com/css-grid-in-ie-faking-an-auto-placement-grid-with-gaps/

const Wrapper = styled.div`
  /* prevents the trailing grid gaps from pushing other stuff around */
  @media (max-width: ${breakpoints.tablet[0]}px) {
    overflow: hidden;
  }
`;

const ChartTitle = styled.span`
  font-size: ${rem(16)};
`;

const ChartPreview = styled.div`
  padding-top: ${rem(16)};
  height: 512px;
`;

const TabList = styled(BasicTabList)`
  display: flex;
  align-items: center;
  padding: 0;

  a {
    margin-left: auto;
    text-decoration: none;
  }
`;

const Button = styled(BasicButton)`
  height: 48px;
  background: ${colors.text};
  padding: ${rem(16)} ${rem(24)};
`;

const TabItem = styled(Tab)`
  padding: ${rem(25)} 0;
  color: ${colors.caption};
  font-size: ${rem(18)};
  border-bottom: 1px solid transparent;
  font-family: "Libre Baskerville";
  font-style: normal;
  font-weight: 400;

  &:first-child {
    margin-left: 0;
  }
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

const DEFAULT_SELECTED_TAB = "Prison";

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
            <BarChartPair data={narrative.populationDataSeries} preview />
          )}
          <ChartTitle>Population by Race/Ethnicity</ChartTitle>
        </>
      </ModelHydrator>
    );
  }
);

const ExploreNarrativeButton: React.FC<{
  narrativeId: NarrativeTypeId;
  tenantId: TenantId;
}> = observer(({ narrativeId, tenantId }) => {
  return (
    <Link
      to={getUrlForResource({
        page: "narrative",
        params: { tenantId, narrativeTypeId: narrativeId },
      })}
      onClick={() =>
        track("narrative_body_link_clicked", {
          category: "navigation",
          label: narrativeId,
        })
      }
    >
      <Button>
        Learn More &nbsp;
        <Arrow direction="right" />
      </Button>
    </Link>
  );
});

const NarrativeTabs: React.FC<{
  narratives: Narrative[];
  tenantId: TenantId;
}> = observer(({ narratives, tenantId }) => {
  const [selectedTab, selectTab] = React.useState<NarrativeTypeId>(
    DEFAULT_SELECTED_TAB
  );
  const [tabIndex, setTabIndex] = React.useState(
    PREVIEW_ORDER.indexOf(DEFAULT_SELECTED_TAB)
  );

  React.useEffect(() => {
    const nextIndex = (tabIndex + 1) % (PREVIEW_ORDER.length - 1);

    const timer = setTimeout(() => {
      setTabIndex(nextIndex);
      selectTab(PREVIEW_ORDER[nextIndex]);
    }, 500000000);

    return () => clearTimeout(timer);
  }, [tabIndex, selectedTab]);

  return (
    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
      <TabList>
        {narratives.map((narrative) => (
          <TabItem key={narrative.id} onClick={() => selectTab(narrative.id)}>
            {narrative.title}
          </TabItem>
        ))}
        <ExploreNarrativeButton narrativeId={selectedTab} tenantId={tenantId} />
      </TabList>

      {narratives.map((narrative) => (
        <TabPanel>
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
const OtherNarrativeLinksPreview = (): React.ReactElement | null => {
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
      <NarrativeTabs tenantId={tenant.id} narratives={narrativesToDisplay} />
    </Wrapper>
  );
};

export default observer(OtherNarrativeLinksPreview);
