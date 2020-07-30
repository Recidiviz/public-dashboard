// eslint-disable-next-line import/prefer-default-export
export const getCorrectionsPopulation = (record) =>
  record.total_incarcerated_population +
  record.total_parole_population +
  record.total_probation_population;
