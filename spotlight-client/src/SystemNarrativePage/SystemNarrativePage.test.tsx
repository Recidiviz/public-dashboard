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
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { createMetricMapping } from "../contentModels/Metric";
import SystemNarrative, {
  createSystemNarrative,
} from "../contentModels/SystemNarrative";
import SystemNarrativePage from ".";
import { SystemNarrativeContent } from "../contentApi/types";
import { MetricMapping } from "../contentModels/types";

function renderPage({
  route = "/",
  narrative,
}: {
  narrative: SystemNarrative;
  route: string;
}) {
  const history = createHistory(createMemorySource(route));

  return {
    ...render(
      <LocationProvider history={history}>
        <SystemNarrativePage narrative={narrative} />
      </LocationProvider>
    ),
    // tests can use history object to simulate navigation in a browser
    history,
  };
}

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

test("renders the narrative intro", () => {
  renderPage({ narrative: testNarrative, route: "/" });

  expect(
    screen.getByRole("heading", { name: narrativeContent.title, level: 1 })
  ).toBeVisible();
  expect(screen.getByText(narrativeContent.introduction)).toBeVisible();
});

test("renders the first section", () => {
  renderPage({ narrative: testNarrative, route: "/1" });
  expect(
    screen.getByRole("heading", { name: narrativeContent.sections[0].title })
  ).toBeVisible();
  expect(screen.getByText(narrativeContent.sections[0].body)).toBeVisible();
});

test("navigation", async () => {
  const {
    history: { navigate },
  } = renderPage({ narrative: testNarrative, route: "/" });

  const nextLabel = "next section";
  const prevLabel = "previous section";

  const nextLink = screen.getByRole("link", { name: nextLabel });

  // no previous on the first page
  expect(
    screen.queryByRole("link", { name: prevLabel })
  ).not.toBeInTheDocument();
  expect(nextLink).toBeInTheDocument();

  fireEvent.click(nextLink);

  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: narrativeContent.sections[0].title })
    ).toBeVisible()
  );

  const prevLink = screen.getByRole("link", { name: prevLabel });

  fireEvent.click(prevLink);

  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: narrativeContent.title, level: 1 })
    ).toBeVisible()
  );

  await navigate(`/${narrativeContent.sections.length}`);

  await waitFor(() =>
    expect(
      screen.getByRole("heading", {
        name:
          narrativeContent.sections[narrativeContent.sections.length - 1].title,
      })
    ).toBeVisible()
  );

  // no next on the last page
  expect(
    screen.queryByRole("link", { name: nextLabel })
  ).not.toBeInTheDocument();
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

  const {
    history: { navigate },
  } = renderPage({ narrative: testNarrative, route: "/" });

  expect(screen.getByRole("link", { name: "intro link" })).toBeVisible();

  await navigate("/1");

  expect(screen.getByRole("link", { name: "section copy link" })).toBeVisible();
});
