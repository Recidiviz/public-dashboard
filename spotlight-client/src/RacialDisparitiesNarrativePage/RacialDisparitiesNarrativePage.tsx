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

import HTMLReactParser from "html-react-parser";
import mapValues from "lodash/mapValues";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import pupa from "pupa";
import React from "react";
import styled from "styled-components/macro";
import RacialDisparitiesNarrative, {
  TemplateVariables,
} from "../contentModels/RacialDisparitiesNarrative";
import ModelHydrator from "../ModelHydrator";
import { NarrativeLayout, StickySection } from "../NarrativeLayout";
import {
  breakpoints,
  FullScreenSection,
  NarrativeIntroContainer as NarrativeIntroContainerBase,
  NarrativeIntroCopy,
  NarrativeSectionBody,
  NarrativeSectionTitle,
  NarrativeTitle,
  wrapExpandedVariable,
} from "../UiLibrary";
import BarChartPair from "../charts/BarChartPair";
import RaceOrEthnicityFilterSelect from "./RaceOrEthnicityFilterSelect";
import SupervisionTypeFilterSelect from "./SupervisionTypeFilterSelect";

const Wrapper = styled.div`
  min-height: 100vh;
`;

const NarrativeIntroContainer = styled(NarrativeIntroContainerBase)`
  padding-bottom: ${rem(124)};
`;

const CopyOnlySection = styled(FullScreenSection)`
  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const SectionColumns = styled(NarrativeSectionBody)`
  padding: ${rem(40)} 0;

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    columns: 3;
    column-gap: ${rem(32)};

    ${NarrativeSectionTitle} {
      break-after: column;
    }

    div {
      break-after: column;
      break-inside: avoid-column;
    }
  }
`;

function wrapDynamicText(vars: TemplateVariables): TemplateVariables {
  return mapValues(vars, (templateVar) => {
    if (typeof templateVar === "string") {
      return wrapExpandedVariable(templateVar);
    }
    return wrapDynamicText(templateVar);
  });
}

type RacialDisparitiesNarrativePageProps = {
  narrative: RacialDisparitiesNarrative;
};

const RacialDisparitiesNarrativePage: React.FC<RacialDisparitiesNarrativePageProps> = ({
  narrative,
}) => {
  const templateData = wrapDynamicText(narrative.templateData);

  return (
    <Wrapper>
      <ModelHydrator model={narrative}>
        <NarrativeLayout
          sections={[
            {
              title: narrative.title,
              contents: (
                <NarrativeIntroContainer>
                  <NarrativeTitle>{narrative.title}</NarrativeTitle>
                  <>
                    <NarrativeIntroCopy>
                      {HTMLReactParser(
                        pupa(narrative.introduction, templateData)
                      )}
                    </NarrativeIntroCopy>
                    {narrative.populationDataSeries && (
                      <BarChartPair
                        data={narrative.populationDataSeries}
                        download={() => narrative.downloadPopulation()}
                        filters={[]}
                        methodology={narrative.introductionMethodology}
                      />
                    )}
                  </>
                </NarrativeIntroContainer>
              ),
            },
            ...narrative.sections.map((section) => {
              let contents;

              // all sections except the conclusion should look like this
              if ("chartData" in section) {
                contents = (
                  <StickySection
                    leftContents={
                      <>
                        <NarrativeSectionTitle>
                          {section.title}
                        </NarrativeSectionTitle>
                        <NarrativeSectionBody>
                          {HTMLReactParser(pupa(section.body, templateData))}
                        </NarrativeSectionBody>
                      </>
                    }
                    rightContents={
                      <BarChartPair
                        data={section.chartData}
                        download={section.download}
                        filters={[
                          <RaceOrEthnicityFilterSelect narrative={narrative} />,
                          section.supervisionFilter ? (
                            <SupervisionTypeFilterSelect
                              narrative={narrative}
                            />
                          ) : null,
                        ]}
                        methodology={section.methodology}
                      />
                    }
                  />
                );
              } else {
                contents = (
                  <CopyOnlySection>
                    <SectionColumns>
                      <NarrativeSectionTitle>
                        {section.title}
                      </NarrativeSectionTitle>
                      {HTMLReactParser(pupa(section.body, templateData))}
                    </SectionColumns>
                  </CopyOnlySection>
                );
              }

              return {
                title: section.title,
                contents,
              };
            }),
          ]}
        />
      </ModelHydrator>
    </Wrapper>
  );
};

export default observer(RacialDisparitiesNarrativePage);
