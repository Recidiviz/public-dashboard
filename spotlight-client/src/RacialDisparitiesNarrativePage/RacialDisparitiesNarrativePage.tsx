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
import mapValues from "lodash.mapvalues";
import { observer } from "mobx-react-lite";
import pupa from "pupa";
import React from "react";
import RacialDisparitiesNarrative, {
  TemplateVariables,
} from "../contentModels/RacialDisparitiesNarrative";
import Loading from "../Loading";
import { NarrativeLayout, StickySection } from "../NarrativeLayout";
import {
  NarrativeIntroContainer,
  NarrativeIntroCopy,
  NarrativeSectionBody,
  NarrativeSectionTitle,
  NarrativeTitle,
  wrapExpandedVariable,
} from "../UiLibrary";

type RacialDisparitiesNarrativePageProps = {
  narrative: RacialDisparitiesNarrative;
};

function wrapDynamicText(vars: TemplateVariables): TemplateVariables {
  return mapValues(vars, (templateVar) => {
    if (typeof templateVar === "string") {
      return wrapExpandedVariable(templateVar);
    }
    return wrapDynamicText(templateVar);
  });
}

const RacialDisparitiesNarrativePage: React.FC<RacialDisparitiesNarrativePageProps> = ({
  narrative,
}) => {
  const templateData = wrapDynamicText(narrative.templateData);

  return (
    <NarrativeLayout
      sections={[
        {
          title: narrative.title,
          contents: (
            <NarrativeIntroContainer>
              <NarrativeTitle>{narrative.title}</NarrativeTitle>
              {narrative.isLoading || narrative.isLoading === undefined ? (
                <Loading />
              ) : (
                <NarrativeIntroCopy>
                  {HTMLReactParser(pupa(narrative.introduction, templateData))}
                </NarrativeIntroCopy>
              )}
            </NarrativeIntroContainer>
          ),
        },
        ...narrative.sections.map((section) => {
          return {
            title: section.title,
            contents: (
              <StickySection
                leftContents={
                  <>
                    <NarrativeSectionTitle>
                      {section.title}
                    </NarrativeSectionTitle>
                    {narrative.isLoading ||
                    narrative.isLoading === undefined ? (
                      <Loading />
                    ) : (
                      <NarrativeSectionBody>
                        {HTMLReactParser(pupa(section.body, templateData))}
                      </NarrativeSectionBody>
                    )}
                  </>
                }
                rightContents={<div>Placeholder for chart</div>}
              />
            ),
          };
        }),
      ]}
    />
  );
};

export default observer(RacialDisparitiesNarrativePage);
