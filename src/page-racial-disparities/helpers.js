import useBreakpoint from "@w11r/use-breakpoint";
import { sum } from "d3-array";
import styled from "styled-components";
import {
  SUPERVISION_TYPES,
  VIOLATION_COUNT_KEYS,
  VIOLATION_TYPES,
  TOTAL_KEY,
} from "../constants";

export const getCorrectionsPopulation = (record) =>
  record.total_incarcerated_population +
  record.total_parole_population +
  record.total_probation_population;

export const getSupervisionCounts = (record) => {
  const [parole, probation, total] = ["parole", "probation", "supervision"].map(
    (supervisionType) => {
      const population = record[`total_${supervisionType}_population`];

      const revocationCount = sum(
        [...VIOLATION_COUNT_KEYS.values()].map(
          (key) => record[`${supervisionType}_${key}`]
        )
      );

      const technicalCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.technical
          )}`
        ];

      const absconsionCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.abscond
          )}`
        ];

      const newOffenseCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.offend
          )}`
        ];

      const unknownCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.unknown
          )}`
        ];

      return {
        population,
        totalRevocations: revocationCount,
        [VIOLATION_TYPES.technical]: technicalCount,
        [VIOLATION_TYPES.abscond]: absconsionCount,
        [VIOLATION_TYPES.offend]: newOffenseCount,
        [VIOLATION_TYPES.unknown]: unknownCount,
      };
    }
  );
  return {
    [SUPERVISION_TYPES.parole]: parole,
    [SUPERVISION_TYPES.probation]: probation,
    [TOTAL_KEY]: total,
  };
};

export const matchRace = (race) => (record) =>
  record.race_or_ethnicity === race;

export const DynamicText = styled.span`
  color: ${(props) => props.theme.colors.highlight};
`;

const BAR_HEIGHTS = { default: 150, small: 70 };

export function useBarHeight() {
  return useBreakpoint(BAR_HEIGHTS.default, ["mobile-", BAR_HEIGHTS.small]);
}
