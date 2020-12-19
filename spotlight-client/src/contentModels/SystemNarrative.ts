// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { SystemNarrativeContent } from "../contentApi/types";
import { AnyMetric, isAnyMetric, MetricMapping } from "./types";

type Section = { title: string; body: string; metric: AnyMetric };

type ConstructorArgs = {
  title: string;
  introduction: string;
  sections: Section[];
};

export default class SystemNarrative {
  readonly title: string;

  readonly introduction: string;

  readonly sections: Section[];

  constructor({ title, introduction, sections }: ConstructorArgs) {
    this.title = title;
    this.introduction = introduction;
    this.sections = sections;
  }
}

export function createSystemNarrative({
  content,
  allMetrics,
}: {
  content: SystemNarrativeContent;
  allMetrics: MetricMapping;
}): SystemNarrative {
  const sections: Section[] = [];
  // building sections in a type-safe way: make sure the related metric
  // actually exists or else the section is omitted
  content.sections.forEach(({ title, body, metricTypeId }) => {
    const metric = allMetrics[metricTypeId];
    if (isAnyMetric(metric)) {
      sections.push({ title, body, metric });
    }
  });

  return new SystemNarrative({
    title: content.title,
    introduction: content.introduction,
    sections,
  });
}