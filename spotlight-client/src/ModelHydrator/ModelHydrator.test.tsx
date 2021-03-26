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

import { render, screen, waitFor } from "@testing-library/react";
import { observable, runInAction } from "mobx";
import React from "react";
import { Hydratable } from "../contentModels/types";
import ModelHydrator from "./ModelHydrator";

const mockHydrate = jest.fn();

const mockModel: Hydratable = observable({
  hydrate: mockHydrate,
});

const HydratedContent = () => <div>hydrated</div>;

beforeEach(() => {
  render(
    <ModelHydrator model={mockModel}>
      <HydratedContent />
    </ModelHydrator>
  );
});

afterEach(() => {
  mockHydrate.mockReset();
});

test("needs hydration", () => {
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  expect(screen.queryByText("hydrated")).not.toBeInTheDocument();
  expect(mockHydrate).toHaveBeenCalled();
});

test("hydration in progress", () => {
  runInAction(() => {
    mockModel.isLoading = true;
  });

  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  expect(screen.queryByText("hydrated")).not.toBeInTheDocument();
});

// TODO (#353) async specs fail intermittently
test.skip("hydrated", async () => {
  runInAction(() => {
    mockModel.isLoading = false;
  });

  await waitFor(() => {
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("hydrated")).toBeInTheDocument();
  });
});

test("hydration error", async () => {
  runInAction(() => {
    mockModel.isLoading = false;
    mockModel.error = new Error("hydration error");
  });

  await waitFor(() => {
    expect(screen.getByRole("status")).toHaveTextContent(/error/i);
    expect(screen.queryByText("hydrated")).not.toBeInTheDocument();
  });
});
