// records that come in as one row per demographic group with many categories
// may need to be transposed into one row per category for use in charts
export default function transposeFieldsToRecords(
  record,
  { colors, keys, labels }
) {
  return Array.from(keys, ([category, fieldKey]) => ({
    color: colors[category],
    label: labels[category],
    value: record ? Number(record[fieldKey]) : 0,
  }));
}
