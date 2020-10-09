import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("does not explode", () => {
  const { getByText } = render(<App />);
  // seems like a pretty safe bet this word will always be there somewhere!
  const websiteName = getByText(/spotlight/i);
  expect(websiteName).toBeInTheDocument();
});
