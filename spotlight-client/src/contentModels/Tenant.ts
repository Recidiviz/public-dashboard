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

import retrieveContent from "../contentApi/retrieveContent";
import {
  CollectionTypeId,
  CollectionTypeIdList,
  MetricTypeId,
  MetricTypeIdList,
  TenantId,
} from "../contentApi/types";
import { createCollection } from "./Collection";
import { createMetric } from "./Metric";

type InitOptions = {
  name: string;
  description: string;
  collections: Map<CollectionTypeId, ReturnType<typeof createCollection>>;
  metrics: Map<MetricTypeId, ReturnType<typeof createMetric>>;
};

export default class Tenant {
  name: string;

  description: string;

  collections: InitOptions["collections"];

  metrics: InitOptions["metrics"];

  constructor({ name, description, collections, metrics }: InitOptions) {
    this.name = name;
    this.description = description;
    this.collections = collections;
    this.metrics = metrics;
  }
}

type TenantFactoryOptions = {
  tenantId: TenantId;
};

function getMetricsForTenant(
  allTenantContent: ReturnType<typeof retrieveContent>
) {
  const metricMapping: InitOptions["metrics"] = new Map();

  // not all metrics are required; content object is the source of truth
  // for which metrics to include
  MetricTypeIdList.forEach((id) => {
    const content = allTenantContent.metrics[id];
    if (content) {
      metricMapping.set(id, content);
    }
  });

  return metricMapping;
}

function getCollectionsForTenant(
  allTenantContent: ReturnType<typeof retrieveContent>
) {
  const collectionMapping: InitOptions["collections"] = new Map();

  // not all metrics are required; content object is the source of truth
  // for which metrics to include
  CollectionTypeIdList.forEach((id) => {
    const content = allTenantContent.collections[id];
    if (content) {
      collectionMapping.set(id, content);
    }
  });

  return collectionMapping;
}

// eslint-disable-next-line import/prefer-default-export
export function createTenant({ tenantId }: TenantFactoryOptions): Tenant {
  const allTenantContent = retrieveContent({ tenantId });

  return new Tenant({
    name: allTenantContent.name,
    description: allTenantContent.description,
    collections: getCollectionsForTenant(allTenantContent),
    metrics: getMetricsForTenant(allTenantContent),
  });
}
