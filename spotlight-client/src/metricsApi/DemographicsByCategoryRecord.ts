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

import { REVOCATION_TYPE_LABELS } from "../constants";
import { RawMetricData } from "./fetchMetrics";
import { DemographicFields } from "./types";
import {
  extractDemographicFields,
  recordIsProbation,
  recordIsParole,
} from "./utils";

export type DemographicsByCategoryRecord = DemographicFields & {
  category: string;
  count: number;
};

function getCategoryTransposeFunction(
  fields: { fieldName: string; categoryLabel: string }[]
) {
  return (records: RawMetricData) => {
    // these come in as wide records that we need to transpose to long
    const recordsByCategory = records.map((record) => {
      return fields.map(({ fieldName, categoryLabel }) => {
        return {
          category: categoryLabel,
          count: Number(record[fieldName]),
          ...extractDemographicFields(record),
        };
      });
    });

    return recordsByCategory.flat();
  };
}

const revocationReasonFields = [
  {
    categoryLabel: REVOCATION_TYPE_LABELS.ABSCOND,
    fieldName: "absconsion_count",
  },
  {
    categoryLabel: REVOCATION_TYPE_LABELS.NEW_CRIME,
    fieldName: "new_crime_count",
  },
  {
    categoryLabel: REVOCATION_TYPE_LABELS.TECHNICAL,
    fieldName: "technical_count",
  },
  { categoryLabel: REVOCATION_TYPE_LABELS.UNKNOWN, fieldName: "unknown_count" },
];

export function probationRevocationReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(revocationReasonFields)(
    rawRecords.filter(recordIsProbation)
  );
}

export function paroleRevocationReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(revocationReasonFields)(
    rawRecords.filter(recordIsParole)
  );
}

const prisonAdmissionFields = [
  { categoryLabel: "New admissions", fieldName: "new_admission_count" },
  { categoryLabel: "Parole revocations", fieldName: "parole_revocation_count" },
  {
    categoryLabel: "Probation revocations",
    fieldName: "probation_revocation_count",
  },
  { categoryLabel: "Other", fieldName: "other_count" },
];

export function prisonAdmissionReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonAdmissionFields)(rawRecords);
}

const prisonReleaseFields = [
  {
    categoryLabel: "Transfer out of system",
    fieldName: "external_transfer_count",
  },
  {
    categoryLabel: "Sentence completion",
    fieldName: "sentence_completion_count",
  },
  { categoryLabel: "Parole", fieldName: "parole_count" },
  { categoryLabel: "Probation", fieldName: "probation_count" },
  { categoryLabel: "Death", fieldName: "death_count" },
];

export function prisonReleaseTypes(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonReleaseFields)(rawRecords);
}

export const prisonStayLengthFields = [
  { categoryLabel: "<1 year", fieldName: "years_0_1" },
  { categoryLabel: "1–2", fieldName: "years_1_2" },
  { categoryLabel: "2–3", fieldName: "years_2_3" },
  { categoryLabel: "3–5", fieldName: "years_3_5" },
  { categoryLabel: "5–10", fieldName: "years_5_10" },
  { categoryLabel: "10–20", fieldName: "years_10_20" },
  { categoryLabel: "20+", fieldName: "years_20_plus" },
];

export function prisonStayLengths(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonStayLengthFields)(rawRecords);
}
