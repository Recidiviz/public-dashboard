import { sum } from "d3-array";

export default function useDataWithPct(data) {
  // calculate percentages for display
  const totalValue = sum(data.map(({ value }) => value));
  return data.map((record) => ({
    ...record,
    pct: record.value / totalValue,
  }));
}
