import useBreakpoint from "@w11r/use-breakpoint";
import { sum } from "d3-array";
import styled from "styled-components";
import {
  SUPERVISION_TYPES,
  VIOLATION_COUNT_KEYS,
  VIOLATION_TYPES,
  TOTAL_KEY,
} from "../constants";

export const getCorrectionsPopulation36Mo = (record) =>
  record.total_incarcerated_population_36_mo +
  record.total_parole_population_36_mo +
  record.total_probation_population_36_mo;

export const getCorrectionsPopulationCurrent = (record) =>
  // TODO: is this the same thing??
  record.current_total_sentenced_count;

export const getSupervisionCounts36Mo = (record) => {
  const [parole, probation, total] = ["parole", "probation", "supervision"].map(
    (supervisionType) => {
      const population = record[`total_${supervisionType}_population_36_mo`];

      const revocationCount = sum(
        [...VIOLATION_COUNT_KEYS.values()].map(
          (key) => record[`${supervisionType}_${key}_36_mo`]
        )
      );

      const technicalCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.technical
          )}_36_mo`
        ];

      const absconsionCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.abscond
          )}_36_mo`
        ];

      const newOffenseCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.offend
          )}_36_mo`
        ];

      const unknownCount =
        record[
          `${supervisionType}_${VIOLATION_COUNT_KEYS.get(
            VIOLATION_TYPES.unknown
          )}_36_mo`
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
