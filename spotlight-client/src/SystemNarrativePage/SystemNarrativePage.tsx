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
import React from "react";
import SystemNarrative from "../contentModels/SystemNarrative";
import {
  Chevron,
  NarrativeIntroContainer,
  NarrativeIntroCopy,
  NarrativeScrollIndicator,
  NarrativeTitle,
} from "../UiLibrary";
import Section from "./Section";
import NarrativeLayout from "../NarrativeLayout";

const SystemNarrativePage: React.FC<{
  narrative: SystemNarrative;
}> = ({ narrative }) => {
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
              <NarrativeScrollIndicator>
                <span>SCROLL</span>
                <Chevron direction="down" faded />
                <Chevron direction="down" />
              </NarrativeScrollIndicator>
            </NarrativeIntroContainer>
          ),
        },
        ...narrative.sections.map((section) => {
          return {
            title: section.title,
            contents: <Section section={section} />,
          };
        }),
      ]}
    />
  );
};

export default SystemNarrativePage;
