import React from "react";
import { render } from "../testUtils";
import PageParole from "./PageParole";

it.skip("renders the sections", () => {
  const { getByText } = render(<PageParole />);
  [
    "Who is on parole?",
    "What happens after parole?",
    "Why do revocations happen?",
    "Free Through Recovery Program",
  ].forEach((sectionTitle) => expect(getByText(sectionTitle)).toBeVisible());
});
