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

import { act } from "@testing-library/react";
import { NarrativesSlug } from "../routerUtils/types";
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

  await act(() => navigate(`/us-nd/${NarrativesSlug}/prison`));
  expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  scrollSpy.mockClear();

  // we cannot really test non-scrolling behavior reliably,
  // because intra-page route changes also trigger scrolling, and JSDOM
  // does not implement any real scrolling functionality
  // so the positions cannot be meaningfully inspected
});
