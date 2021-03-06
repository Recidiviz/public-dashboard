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
import { observer } from "mobx-react-lite";
import React from "react";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import { NarrativeLayout, StickySection } from "../NarrativeLayout";
import {
  NarrativeIntroContainer,
  NarrativeIntroCopy,
  NarrativeSectionBody,
  NarrativeSectionTitle,
  NarrativeTitle,
} from "../UiLibrary";

type RacialDisparitiesNarrativePageProps = {
  narrative: RacialDisparitiesNarrative;
};

const RacialDisparitiesNarrativePage: React.FC<RacialDisparitiesNarrativePageProps> = ({
  narrative,
}) => {
  return (
    <NarrativeLayout
      sections={[
        {
          title: narrative.title,
          contents: (
            <NarrativeIntroContainer>
              <NarrativeTitle>{narrative.title}</NarrativeTitle>
              <NarrativeIntroCopy>
                {HTMLReactParser(narrative.introduction)}
              </NarrativeIntroCopy>
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
                    <NarrativeSectionBody>
                      {HTMLReactParser(section.body)}
                    </NarrativeSectionBody>
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
