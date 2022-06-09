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

import { RidersNarrativeContent } from "../contentApi/types";
import Metric from "./Metric";
import { MetricMapping, MetricRecord } from "./types";

export type RidersNarrativeSection = {
  title: string;
  body: string;
  type?: "text" | "metric";
  metric?: Metric<MetricRecord>;
};

type ConstructorArgs = {
  title: string;
  type?: string;
  introduction: string;
  sections: RidersNarrativeSection[];
};

export default class RidersNarrative {
  readonly id = "Riders";

  readonly title: string;

  readonly introduction: string;

  readonly sections: RidersNarrativeSection[];

  constructor({ title, introduction, sections }: ConstructorArgs) {
    this.title = title;
    this.introduction = introduction;
    this.sections = sections;
  }
}

export function createRidersNarrative({
  content,
  allMetrics,
}: {
  content: RidersNarrativeContent;
  allMetrics: MetricMapping;
}): RidersNarrative {
  const sections: RidersNarrativeSection[] = [];
  // building sections in a type-safe way: make sure the related metric
  // actually exists or else the section is omitted
  content.sections.forEach(({ title, body, type, metricTypeId }) => {
    const metric = metricTypeId && allMetrics.get(metricTypeId);
    if (metric instanceof Metric) {
      sections.push({ title, body, metric });
    }
    if (!metric) {
      sections.push({ title, body, type });
    }
  });

  return new RidersNarrative({
    title: content.title,
    introduction: content.introduction,
    sections,
  });
}
