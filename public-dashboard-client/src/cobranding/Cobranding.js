import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components/macro";

import cobrandingSrc from "../assets/images/us_nd_cobranding.png";
import cobrandingLightSrc from "../assets/images/us_nd_cobranding_light.png";

const COBRANDING_ALT = "North Dakota";
const COBRANDING_URL = "https://www.docr.nd.gov/";

const CobrandingLink = styled.a`
  align-self: flex-start;
`;

const CobrandingImg = styled.img`
  height: 34px;
  width: 64px;
`;

export default function Cobranding({ light }) {
  return (
    <CobrandingLink href={COBRANDING_URL}>
      <CobrandingImg
        alt={COBRANDING_ALT}
        src={light ? cobrandingLightSrc : cobrandingSrc}
      />
    </CobrandingLink>
  );
}

Cobranding.propTypes = {
  light: PropTypes.bool,
};

Cobranding.defaultProps = {
  light: false,
};
