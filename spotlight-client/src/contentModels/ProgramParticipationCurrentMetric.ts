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

import { computed, makeObservable } from "mobx";
import type { Topology } from "topojson-specification";
import { ProgramParticipationCurrentRecord } from "../metricsApi";
import Metric, { BaseMetricConstructorOptions } from "./Metric";

export default class ProgramParticipationCurrentMetric extends Metric<
  ProgramParticipationCurrentRecord
> {
  /**
   * needed to plot metric records on a map
   */
  readonly topology: Topology;

  constructor(
    props: BaseMetricConstructorOptions<ProgramParticipationCurrentRecord> & {
      topology: Topology;
    }
  ) {
    super(props);

    this.topology = props.topology;

    makeObservable(this, { dataMapping: computed });
  }

  /**
   * Provides counts mapped by locality ID rather than in series.
   */
  get dataMapping(): Record<string, number> | undefined {
    const { records } = this;
    if (!records) return undefined;

    return records.reduce((mapping, record) => {
      return { ...mapping, [record.locality]: record.count };
    }, {});
  }
}
