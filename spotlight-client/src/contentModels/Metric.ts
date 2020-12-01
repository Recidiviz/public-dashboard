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

import { MetricContent } from "../contentApi/types";
import { CollectionMap } from "./types";

type InitOptions = {
  name: string;
  description: string;
};

/**
 * Represents a single dataset backed by data from our metrics API.
 * The recommended way to instantiate a `Metric` is with the `createMetric`
 * factory exported from this module.
 */
export default class Metric {
  description: string;

  name: string;

  collections: CollectionMap = new Map();

  constructor({ name, description }: InitOptions) {
    this.name = name;
    this.description = description;
  }
}

/**
 * Factory function for creating an instance of `Metric`.
 */
export function createMetric({ name, description }: MetricContent): Metric {
  return new Metric({ name, description });
}
