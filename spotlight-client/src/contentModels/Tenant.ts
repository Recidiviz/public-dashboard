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
import RootStore from "../DataStore/RootStore";
import createMetricMapping from "./createMetricMapping";
import RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";
import RidersNarrative, { createRidersNarrative } from "./RidersNarrative";
import { createSystemNarrative } from "./SystemNarrative";
import { MetricMapping, SystemNarrativeMapping } from "./types";

export type InitOptions = {
  id: TenantId;
  name: string;
  docName: string;
  docLink: string;
  description: string;
  ctaCopy?: string;
  coBrandingCopy: string;
  feedbackUrl: string;
  smallDataDisclaimer: string;
  metrics: MetricMapping;
  systemNarratives: SystemNarrativeMapping;
  racialDisparitiesNarrative?: RacialDisparitiesNarrative;
  ridersNarrative?: RidersNarrative;
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

  readonly docName: string;

  readonly docLink: string;

  readonly description: string;

  readonly ctaCopy?: string;

  readonly coBrandingCopy: string;

  readonly feedbackUrl: string;

  readonly smallDataDisclaimer: string;

  readonly metrics: MetricMapping;

  readonly systemNarratives: SystemNarrativeMapping;

  readonly racialDisparitiesNarrative?: RacialDisparitiesNarrative;

  readonly ridersNarrative?: RidersNarrative;

  constructor({
    id,
    name,
    docName,
    docLink,
    description,
    ctaCopy,
    coBrandingCopy,
    feedbackUrl,
    smallDataDisclaimer,
    metrics,
    systemNarratives,
    racialDisparitiesNarrative,
    ridersNarrative,
  }: InitOptions) {
    this.id = id;
    this.name = name;
    this.docName = docName;
    this.docLink = docLink;
    this.description = description;
    this.ctaCopy = ctaCopy;
    this.coBrandingCopy = coBrandingCopy;
    this.feedbackUrl = feedbackUrl;
    this.smallDataDisclaimer = smallDataDisclaimer;
    this.metrics = metrics;
    this.systemNarratives = systemNarratives;
    this.racialDisparitiesNarrative = racialDisparitiesNarrative;
    this.ridersNarrative = ridersNarrative;
  }
}

type TenantFactoryOptions = {
  tenantId: TenantId;
  rootStore?: RootStore;
};

function getMetricsForTenant(
  allTenantContent: ReturnType<typeof retrieveContent>,
  tenantId: TenantId,
  rootStore?: RootStore
) {
  return createMetricMapping({
    localityLabelMapping: allTenantContent.localities,
    metadataMapping: allTenantContent.metrics,
    topologyMapping: allTenantContent.topologies,
    tenantId,
    demographicFilter: allTenantContent.demographicCategories,
    demographicLabels: allTenantContent.demographicLabels,
    rootStore,
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

function getRidersNarrativeForTenant({
  allTenantContent,
  metrics: allMetrics,
}: MetricRelatedModelOptions) {
  const content = allTenantContent.ridersNarrative;
  if (content) {
    return createRidersNarrative({ content, allMetrics });
  }

  return undefined;
}

/**
 * Factory function for creating an instance of the `Tenant` specified by `tenantId`.
 */
export function createTenant({
  tenantId,
  rootStore,
}: TenantFactoryOptions): Tenant {
  const allTenantContent = retrieveContent({ tenantId });

  const metrics = getMetricsForTenant(allTenantContent, tenantId, rootStore);

  const racialDisparitiesNarrative =
    allTenantContent.racialDisparitiesNarrative &&
    RacialDisparitiesNarrative.build({
      tenantId,
      content: allTenantContent.racialDisparitiesNarrative,
      categoryFilter: allTenantContent.demographicCategories?.raceOrEthnicity,
      demographicLabels: allTenantContent.demographicLabels,
      rootStore,
    });

  return new Tenant({
    id: tenantId,
    name: allTenantContent.name,
    docName: allTenantContent.docName,
    docLink: allTenantContent.docLink,
    description: allTenantContent.description,
    ctaCopy: allTenantContent.ctaCopy,
    coBrandingCopy: allTenantContent.coBrandingCopy,
    feedbackUrl: allTenantContent.feedbackUrl,
    smallDataDisclaimer: allTenantContent.smallDataDisclaimer,
    metrics,
    systemNarratives: getSystemNarrativesForTenant({
      allTenantContent,
      metrics,
    }),
    racialDisparitiesNarrative,
    ridersNarrative: getRidersNarrativeForTenant({
      allTenantContent,
      metrics,
    }),
  });
}
