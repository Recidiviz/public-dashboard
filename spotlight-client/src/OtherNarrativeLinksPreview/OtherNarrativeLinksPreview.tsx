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

import { Link } from "@reach/router";
import { ascending } from "d3-array";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import { animated, useSpring } from "react-spring/web.cjs";
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

const LinkList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  font-size: ${rem(24)};
  line-height: 1.5;
  /* this margin makes the cells flush left and right */
  margin: ${rem(48)} -${rem(32)} 0 0;
`;

const LinkListItem = styled.li`
  /* creates gaps */
  border: 0 solid transparent;
  border-width: 0 ${rem(32)} 0 0;
  flex: 0 0 auto;
  white-space: nowrap;
  /* use width to create 1-4 columns, depending on screen size */
  width: 100%;

  @media (min-width: ${breakpoints.tablet[0]}px) {
    width: calc(100% / 1);
  }

  @media (min-width: ${breakpoints.desktop[0]}px) {
    width: calc(100% / 1);
  }

  @media (min-width: ${breakpoints.xl[0]}px) {
    width: calc(100% / 2);
  }

  a {
    border-top: 1px solid ${colors.rule};
    color: ${colors.text};
    display: block;
    padding-right: ${rem(8)};
    padding-top: ${rem(24)};
    padding-bottom: ${rem(24)};
    text-decoration: none;
    width: 100%;
  }

  a:not(:last-child) {
    border-bottom: 1px solid ${colors.rule};
  }
`;

const LinkText = styled.span`
  white-space: normal;
`;

const ChartTitle = styled.span`
  font-size: ${rem(16)};
`;

const ChartPreview = styled.div`
  padding-top: ${rem(16)};
`;

const PREVIEW_ORDER: NarrativeTypeId[] = [
  "Prison",
  "RacialDisparities",
  "Parole",
  "Probation",
  "Sentencing",
];

const ChartPreviewComponent: React.FC<{
  narrative: Narrative;
}> = ({ narrative }) => {
  if (narrative instanceof SystemNarrative && narrative.preview)
    return (
      <>
        <ChartTitle>{narrative.previewTitle}</ChartTitle>
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
          <ChartTitle>Population by Race/Ethnicity</ChartTitle>
          {narrative.populationDataSeries && (
            <BarChartPair data={narrative.populationDataSeries} preview />
          )}
        </>
      </ModelHydrator>
    );
  }
);

const NarrativeLink: React.FC<{
  narrative: Narrative;
  tenantId: TenantId;
}> = observer(({ narrative, tenantId }) => {
  const [animationStyles, setAnimationStyles] = useSpring(() => ({
    opacity: 0,
    from: { opacity: 0 },
  }));

  return (
    <LinkListItem>
      <Link
        to={getUrlForResource({
          page: "narrative",
          params: { tenantId, narrativeTypeId: narrative.id },
        })}
        onClick={() =>
          track("narrative_body_link_clicked", {
            category: "navigation",
            label: narrative.id,
          })
        }
        onMouseOver={() => setAnimationStyles({ opacity: 1 })}
        onFocus={() => setAnimationStyles({ opacity: 1 })}
        onMouseOut={() => setAnimationStyles({ opacity: 0 })}
        onBlur={() => setAnimationStyles({ opacity: 0 })}
      >
        <LinkText>{narrative.title} Data</LinkText>&nbsp;
        <animated.span style={animationStyles}>
          <Arrow color={colors.link} direction="right" />
        </animated.span>
      </Link>
      <ChartPreviewComponent narrative={narrative} />
    </LinkListItem>
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
      <LinkList>
        {narrativesToDisplay.map((narrative) => {
          if (!narrative) return null;

          return (
            <NarrativeLink
              key={narrative.id}
              tenantId={tenant.id}
              narrative={narrative}
            />
          );
        })}
      </LinkList>
    </Wrapper>
  );
};

export default observer(OtherNarrativeLinksPreview);
