import React from "react";
import DetailPage from "../detail-page";
import useChartData from "../hooks/useChartData";
import VizPrisonReleases from "../viz-prison-releases";

const TITLE = "Prison";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;

export default function PagePrison() {
  const { apiData, isLoading } = useChartData("us_nd/prison");

  if (isLoading) {
    return null;
  }

  const SECTIONS = [
    {
      title: "Where do they go from there?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
      showDimensionControl: true,
      VizComponent: VizPrisonReleases,
      vizData: {
        releaseTypes: apiData.incarceration_releases_by_type_by_period.filter(
          (record) => record.metric_period_months === "36"
        ),
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
