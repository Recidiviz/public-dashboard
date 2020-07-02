import React from "react";
import DetailPage from "../detail-page";

const TITLE = "Parole";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;
const SECTIONS = [
  {
    title: "Who is on parole?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: false,
    showTimeControl: false,
  },
  {
    title: "What happens after parole?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    showTimeControl: false,
  },
  {
    title: "Why do revocations happen?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    showTimeControl: true,
  },
  {
    title: "Free Through Recovery Program",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    showTimeControl: false,
  },
];

export default function PageParole() {
  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
