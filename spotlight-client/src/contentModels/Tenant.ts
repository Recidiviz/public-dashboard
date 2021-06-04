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
import { SystemNarrativeTypeIdList, TenantId } from "../contentApi/types";
import createMetricMapping from "./createMetricMapping";
import RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";
import { createSystemNarrative } from "./SystemNarrative";
import { MetricMapping, SystemNarrativeMapping } from "./types";

type InitOptions = {
  id: TenantId;
  name: string;
  description: string;
  coBrandingCopy: string;
  feedbackUrl: string;
  metrics: MetricMapping;
  systemNarratives: SystemNarrativeMapping;
  racialDisparitiesNarrative?: RacialDisparitiesNarrative;
};

/**
 * Represents a jurisdiction or entity (e.g. a U.S. state) that owns `Metric`s.
 * The recommended way to instantiate a `Tenant` is with the `createTenant` factory
 * exported from this module; it contains all logic needed for retrieving the
 * `Tenant`'s "content" object, which contains all metadata and determines which
 * `Metric`s will be instantiated for the `Tenant`.
 */
export default class Tenant {
  readonly id: TenantId;

  readonly name: string;

  readonly description: string;

  readonly coBrandingCopy: string;

  readonly feedbackUrl: string;

  readonly metrics: InitOptions["metrics"];

  readonly systemNarratives: SystemNarrativeMapping;

  readonly racialDisparitiesNarrative?: RacialDisparitiesNarrative;

  constructor({
    id,
    name,
    description,
    coBrandingCopy,
    feedbackUrl,
    metrics,
    systemNarratives,
    racialDisparitiesNarrative,
  }: InitOptions) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.coBrandingCopy = coBrandingCopy;
    this.feedbackUrl = feedbackUrl;
    this.metrics = metrics;
    this.systemNarratives = systemNarratives;
    this.racialDisparitiesNarrative = racialDisparitiesNarrative;
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
    localityLabelMapping: allTenantContent.localities,
    metadataMapping: allTenantContent.metrics,
    topologyMapping: allTenantContent.topologies,
    tenantId,
    demographicFilter: allTenantContent.demographicCategories,
  });
}

type MetricRelatedModelOptions = {
  allTenantContent: ReturnType<typeof retrieveContent>;
  metrics: MetricMapping;
};

function getSystemNarrativesForTenant({
  allTenantContent,
  metrics: allMetrics,
}: MetricRelatedModelOptions) {
  const narrativeMapping: SystemNarrativeMapping = {};
  SystemNarrativeTypeIdList.forEach((id) => {
    const content = allTenantContent.systemNarratives[id];
    if (content) {
      narrativeMapping[id] = createSystemNarrative({ id, content, allMetrics });
    }
  });

  return narrativeMapping;
}

/**
 * Factory function for creating an instance of the `Tenant` specified by `tenantId`.
 */
export function createTenant({ tenantId }: TenantFactoryOptions): Tenant {
  const allTenantContent = retrieveContent({ tenantId });

  const metrics = getMetricsForTenant(allTenantContent, tenantId);

  const racialDisparitiesNarrative =
    allTenantContent.racialDisparitiesNarrative &&
    RacialDisparitiesNarrative.build({
      tenantId,
      content: allTenantContent.racialDisparitiesNarrative,
      categoryFilter: allTenantContent.demographicCategories?.raceOrEthnicity,
    });

  return new Tenant({
    id: tenantId,
    name: allTenantContent.name,
    description: allTenantContent.description,
    coBrandingCopy: allTenantContent.coBrandingCopy,
    feedbackUrl: allTenantContent.feedbackUrl,
    metrics,
    systemNarratives: getSystemNarrativesForTenant({
      allTenantContent,
      metrics,
    }),
    racialDisparitiesNarrative,
  });
}
