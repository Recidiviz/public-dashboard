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

import { render, screen } from "@testing-library/react";
import React from "react";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { createMetricMapping } from "../contentModels/Metric";
import SystemNarrative, {
  createSystemNarrative,
} from "../contentModels/SystemNarrative";
import SystemNarrativePage from ".";
import { SystemNarrativeContent } from "../contentApi/types";
import { MetricMapping } from "../contentModels/types";

let allMetrics: MetricMapping;
let testNarrative: SystemNarrative;
let narrativeContent: SystemNarrativeContent;

beforeEach(() => {
  allMetrics = createMetricMapping({
    tenantId: "US_ND",
    metadataMapping: contentFixture.metrics,
  });

  narrativeContent = JSON.parse(
    JSON.stringify(contentFixture.systemNarratives.Parole)
  );

  testNarrative = createSystemNarrative({
    content: narrativeContent,
    allMetrics,
  });
});

test("renders all the sections", () => {
  render(<SystemNarrativePage narrative={testNarrative} />);

  expect(
    screen.getByRole("heading", { name: narrativeContent.title, level: 1 })
  ).toBeVisible();
  expect(screen.getByText(narrativeContent.introduction)).toBeInTheDocument();

  narrativeContent.sections.forEach((section) => {
    expect(
      screen.getByRole("heading", { name: section.title })
    ).toBeInTheDocument();
    expect(screen.getByText(section.body)).toBeInTheDocument();
  });
});

test("navigation", async () => {
  render(<SystemNarrativePage narrative={testNarrative} />);

  const nextLabel = "next section";
  const prevLabel = "previous section";

  const nextLink = screen.getByRole("link", { name: nextLabel });

  // no previous on the first section
  expect(
    screen.queryByRole("link", { name: prevLabel })
  ).not.toBeInTheDocument();
  expect(nextLink).toBeInTheDocument();

  // Jest/JSDOM don't support native browser navigation features
  // so we can't really test anything related to URL hash changes :(
});

test("renders link tags in copy", async () => {
  narrativeContent.introduction +=
    '<a href="https://example.com">intro link</a>';
  narrativeContent.sections[0].body +=
    '<a href="https://example.com">section copy link</a>';

  testNarrative = createSystemNarrative({
    content: narrativeContent,
    allMetrics,
  });

  render(<SystemNarrativePage narrative={testNarrative} />);

  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "section copy link" })
  ).toBeInTheDocument();
});
