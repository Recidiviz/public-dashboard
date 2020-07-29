export default function recordIsMetricPeriodMonths(months) {
  return (record) => record.metric_period_months === `${months}`;
}
