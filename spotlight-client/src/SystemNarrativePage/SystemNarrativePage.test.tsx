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

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { createMetricMapping } from "../contentModels/Metric";
import SystemNarrative, {
  createSystemNarrative,
} from "../contentModels/SystemNarrative";
import SystemNarrativePage from ".";
import { SystemNarrativeContent } from "../contentApi/types";
import { MetricMapping } from "../contentModels/types";
import { renderWithRouter } from "../testUtils";

let allMetrics: MetricMapping;
let testNarrative: SystemNarrative;
let narrativeContent: SystemNarrativeContent;

jest.mock("@reach/router", () => {
  return {
    ...jest.requireActual("@reach/router"),
    // simulates being at the proper page without setting up a whole router
    useParams: jest.fn().mockImplementation(() => ({
      tenantId: "us_nd",
      narrativeTypeId: "parole",
    })),
  };
});

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
  renderWithRouter(<SystemNarrativePage narrative={testNarrative} />);

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
  renderWithRouter(<SystemNarrativePage narrative={testNarrative} />);

  const nextLabel = "next section";
  const prevLabel = "previous section";

  const navRegion = screen.getByRole("navigation", { name: "page sections" });

  const nextLink = screen.getByRole("link", { name: nextLabel });

  // no previous on the first section
  expect(
    screen.queryByRole("link", { name: prevLabel })
  ).not.toBeInTheDocument();
  expect(nextLink).toBeInTheDocument();

  expect(within(navRegion).getByText("01")).toBeInTheDocument();

  // advance to section 2
  fireEvent.click(nextLink);
  await waitFor(() =>
    expect(within(navRegion).getByText("02")).toBeInTheDocument()
  );

  const prevLink = screen.getByRole("link", { name: prevLabel });
  expect(prevLink).toBeInTheDocument();

  // advance to the last section
  testNarrative.sections.forEach(() => fireEvent.click(nextLink));

  // both of the page numbers should be the same, e.g. 08/08
  expect(
    within(navRegion).getAllByText(`0${testNarrative.sections.length + 1}`)
      .length
  ).toBe(2);

  // no next on the last section
  expect(nextLink).not.toBeInTheDocument();

  // Jest/JSDOM don't support layout features
  // so we can't really test anything related to scroll position :(
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

  renderWithRouter(<SystemNarrativePage narrative={testNarrative} />);

  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "section copy link" })
  ).toBeInTheDocument();
});
