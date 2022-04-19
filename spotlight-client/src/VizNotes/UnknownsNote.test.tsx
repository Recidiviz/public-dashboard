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

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { renderWithTheme } from "../testUtils";
import { UnknownsNote } from "./UnknownsNote";

test("format single unknowns", () => {
  render(
    <UnknownsNote unknowns={{ gender: 1, ageBucket: 4, raceOrEthnicity: 0 }} />
  );

  expect(screen.getByText("age group (4), gender (1).", { exact: false }));
});

test("format unknowns by date", () => {
  render(
    <UnknownsNote
      unknowns={[
        {
          date: new Date(2021, 0),
          unknowns: { gender: 1, ageBucket: 0, raceOrEthnicity: 1 },
        },
        {
          date: new Date(2021, 1),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
      ]}
    />
  );

  expect(
    screen.getByText(
      "gender (1), race or ethnicity (1) for Jan 1 2021; gender (2) for Feb 1 2021.",
      { exact: false }
    )
  );
});

test("format unknowns by cohort", () => {
  render(
    <UnknownsNote
      unknowns={[
        {
          cohort: 2012,
          unknowns: { gender: 1, ageBucket: 2, raceOrEthnicity: 3 },
        },
      ]}
    />
  );

  expect(
    screen.getByText(
      "age group (2), gender (1), race or ethnicity (3) for the 2012 cohort.",
      { exact: false }
    )
  );
});

test("truncate long lists", () => {
  renderWithTheme(
    <UnknownsNote
      unknowns={[
        {
          date: new Date(2021, 0),
          unknowns: { gender: 1, ageBucket: 0, raceOrEthnicity: 1 },
        },
        {
          date: new Date(2021, 1),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 2),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 3),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 4),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
      ]}
    />
  );

  const noteText = screen.getByText("for Jan 1 2021;", { exact: false });
  expect(noteText).not.toHaveTextContent("for Apr 1 2021");
  expect(noteText).not.toHaveTextContent("for May 1 2021");
  expect(noteText).toHaveTextContent("+ 2 more");
});

test("expand and collapse overflowing text", () => {
  renderWithTheme(
    <UnknownsNote
      unknowns={[
        {
          date: new Date(2021, 0),
          unknowns: { gender: 1, ageBucket: 0, raceOrEthnicity: 1 },
        },
        {
          date: new Date(2021, 1),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 2),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 3),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
        {
          date: new Date(2021, 4),
          unknowns: { gender: 2, ageBucket: 0, raceOrEthnicity: 0 },
        },
      ]}
    />
  );

  const collapseButton = screen.getByRole("button", { name: "+ 2 more" });

  expect(collapseButton).toBeVisible();

  fireEvent.click(collapseButton);

  const noteText = screen.getByText("for Apr 1 2021;", { exact: false });
  expect(noteText).toHaveTextContent("for May 1 2021");

  expect(collapseButton).toHaveTextContent("(Hide extended list)");

  fireEvent.click(collapseButton);
  expect(noteText).not.toHaveTextContent("for Apr 1 2021");
  expect(noteText).not.toHaveTextContent("for May 1 2021");
  expect(collapseButton).toHaveTextContent("+ 2 more");
});
