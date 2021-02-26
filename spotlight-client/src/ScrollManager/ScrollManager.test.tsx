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

import { waitFor } from "@testing-library/react";
import { renderNavigableApp } from "../testUtils";

const scrollSpy = jest.spyOn(window, "scrollTo");

afterEach(() => {
  jest.clearAllMocks();
});

test("scrolls on page change", async () => {
  const {
    history: { navigate },
  } = renderNavigableApp();

  expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  scrollSpy.mockClear();

  navigate("/us-nd");
  await waitFor(() => expect(scrollSpy).toHaveBeenCalledWith(0, 0));
  scrollSpy.mockClear();

  navigate("/us-nd/collections/prison");
  await waitFor(() => expect(scrollSpy).toHaveBeenCalledWith(0, 0));
  scrollSpy.mockClear();

  // don't think we can really test non-scrolling behavior reliably,
  // because intra-page route changes also trigger scrolling
});
