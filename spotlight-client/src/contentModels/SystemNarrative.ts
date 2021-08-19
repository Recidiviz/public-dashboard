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

import {
  SystemNarrativeContent,
  SystemNarrativeTypeId,
} from "../contentApi/types";
import Metric from "./Metric";
import { MetricMapping, MetricRecord } from "./types";

export type SystemNarrativeSection = {
  title: string;
  body: string;
  metric: Metric<MetricRecord>;
};

type ConstructorArgs = {
  id: SystemNarrativeTypeId;
  title: string;
  subtitle: string;
  introduction: string;
  sections: SystemNarrativeSection[];
};

export default class SystemNarrative {
  readonly id: SystemNarrativeTypeId;

  readonly title: string;

  readonly subtitle: string;

  readonly introduction: string;

  readonly sections: SystemNarrativeSection[];

  constructor({ id, title, subtitle, introduction, sections }: ConstructorArgs) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.introduction = introduction;
    this.sections = sections;
  }
}

export function createSystemNarrative({
  id,
  content,
  allMetrics,
}: {
  id: SystemNarrativeTypeId;
  content: SystemNarrativeContent;
  allMetrics: MetricMapping;
}): SystemNarrative {
  const sections: SystemNarrativeSection[] = [];
  // building sections in a type-safe way: make sure the related metric
  // actually exists or else the section is omitted
  content.sections.forEach(({ title, body, metricTypeId }) => {
    const metric = allMetrics.get(metricTypeId);
    if (metric instanceof Metric) {
      sections.push({ title, body, metric });
    }
  });

  return new SystemNarrative({
    id,
    title: content.title,
    subtitle: content.subtitle,
    introduction: content.introduction,
    sections,
  });
}
