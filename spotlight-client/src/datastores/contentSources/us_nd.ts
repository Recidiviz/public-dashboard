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

import { TenantContent } from "../retrieveContent";

const content: TenantContent = {
  name: "North Dakota",
  description:
    '<a href="https://www.docr.nd.gov">The North Dakota Department of Corrections and Rehabilitation (DOCR)</a> provides correctional services for the state of North Dakota. Our mission is to transform lives, influence change, and strengthen community. Transparency is a critical element of our mission; sharing information builds greater accountability between the DOCR and the communities we serve. To this end, this collection of data visualizations is built to answer important questions that the public may have about the state of our correctional system in North Dakota. The data represented here is updated every day.',
  metrics: {
    SentencePopulationCurrent: {
      name: "Who is being sentenced?",
      description:
        "After being convicted of a Class A misdemeanor or greater offense by a district court, a person may be sentenced to time in prison or probation, at which point they come under the jurisdiction of the Department of Corrections and Rehabilitation (DOCR). These charts show everyone currently involved with the North Dakota DOCR.",
      methodology:
        "This includes all individuals that are currently incarcerated, on parole, or on probation in North Dakota.",
    },
    SentenceTypesCurrent: {
      name: "What types of sentences do people receive?",
      description:
        "Sentences that lead to individuals coming under DOCR jurisdiction fall broadly into two categories: Probation and Incarceration.",
      methodology:
        "Incarceration includes any sentence that begins with a period of incarceration in a ND DOCR facility. Probation includes any sentence that begins with a period of probation under the supervision of a ND DOCR probation officer. <p>Of note, individuals’ current status (incarcerated or on supervision) may differ from their sentence category (incarceration or probation). Individuals now on parole after being incarcerated are still counted in the incarceration sentence category. Individuals who have had their probation revoked and are now in prison are likewise included in the probation sentence category because their sentence was first to probation.</p><p>It is possible for an individual to be serving both incarceration and probation sentences simultaneously. These individuals are counted in the “Both” category.</p>",
    },
  },
};

export default content;
