export default function formatLocation({ locations, idFn, labelFn }) {
  return locations.map((record) => {
    return {
      // retain the original fields, which may be of use to viz components
      ...record,
      // transform record list into the format required for location controls
      id: idFn(record),
      label: labelFn(record),
    };
  });
}
