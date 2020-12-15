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
import { CollectionTypeIdList, TenantId } from "../contentApi/types";
import { createCollection } from "./Collection";
import { createMetricMapping } from "./Metric";
import { CollectionMap, MetricMapping } from "./types";

type InitOptions = {
  readonly name: string;
  readonly description: string;
  readonly collections: CollectionMap;
  readonly metrics: MetricMapping;
};

/**
 * Represents a jurisdiction or entity (e.g. a U.S. state) that owns `Metric`s.
 * The recommended way to instantiate a `Tenant` is with the `createTenant` factory
 * exported from this module; it contains all logic needed for retrieving the
 * `Tenant`'s "content" object, which contains all metadata and determines which
 * `Collection`s and `Metric`s will be instantiated for the `Tenant`.
 */
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
  allTenantContent: ReturnType<typeof retrieveContent>,
  tenantId: TenantId
) {
  return createMetricMapping({
    metadataMapping: allTenantContent.metrics,
    tenantId,
  });
}

function getCollectionsForTenant({
  allTenantContent,
  metrics,
}: {
  allTenantContent: ReturnType<typeof retrieveContent>;
  metrics: MetricMapping;
}) {
  const collectionMapping: InitOptions["collections"] = new Map();

  // not all collections are required; content object is the source of truth
  // for which collections to include
  CollectionTypeIdList.forEach((id) => {
    const content = allTenantContent.collections[id];
    if (content) {
      collectionMapping.set(
        id,
        createCollection({ ...content, typeId: id, metrics })
      );
    }
  });

  return collectionMapping;
}

/**
 * Factory function for creating an instance of the `Tenant` specified by `tenantId`.
 */
export function createTenant({ tenantId }: TenantFactoryOptions): Tenant {
  const allTenantContent = retrieveContent({ tenantId });

  const metrics = getMetricsForTenant(allTenantContent, tenantId);

  return new Tenant({
    name: allTenantContent.name,
    description: allTenantContent.description,
    collections: getCollectionsForTenant({ allTenantContent, metrics }),
    metrics,
  });
}
