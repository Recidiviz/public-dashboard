import recordIsTotal from "./recordIsTotal";

export default function locationTotals(
  populationDemographics,
  locations,
  populationAccessorFn,
  locationAccessorFn
) {
  return (
    populationDemographics
      .filter(recordIsTotal)
      .map((record) => {
        const locationData = locations.find(
          // these are stored as both strings and numbers;
          // doing an extra typecast here just to be safe
          (location) =>
            `${locationAccessorFn(location)}` ===
            `${locationAccessorFn(record)}`
        );
        if (locationData) {
          return {
            location: locationAccessorFn(record),
            lat: locationData.lat,
            long: locationData.long,
            value: populationAccessorFn(record),
          };
        }
        return null;
      })
      // drop any nulls from the previous step
      .filter((record) => record)
  );
}
