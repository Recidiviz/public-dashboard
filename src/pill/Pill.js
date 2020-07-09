import React from "react";
import PropTypes from "prop-types";

import { PillContainer, PillValue } from "./shared";

export default function Pill({ children }) {
  return (
    <PillContainer>
      <PillValue>{children}</PillValue>
    </PillContainer>
  );
}

Pill.propTypes = {
  children: PropTypes.string.isRequired,
};
