import recordIsTotal from "./recordIsTotal";
import { TOTAL_KEY } from "../constants";

export default function judicialDistrictTotals(
  populationDemographics,
  locations,
  populationAccessorFn
) {
  return (
    populationDemographics
      .filter(recordIsTotal)
      .map((record) => {
        const judicialDistrictData = [...locations, { id: TOTAL_KEY }].find(
          // these are stored as both strings and numbers;
          // doing an extra typecast here just to be safe
          (loc) => `${loc.id}` === `${record.district}`
        );
        if (judicialDistrictData) {
          return {
            district: `${record.district}`,
            value: populationAccessorFn(record),
          };
        }
        return null;
      })
      // drop any nulls from the previous step
      .filter((record) => record)
  );
}
