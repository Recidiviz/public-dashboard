import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import cobrandingSrc from "../assets/images/us_nd_cobranding.png";
import cobrandingLightSrc from "../assets/images/us_nd_cobranding_light.png";

const COBRANDING_ALT = "North Dakota";
const COBRANDING_URL = "https://www.docr.nd.gov/";

export const RecidivizBrandingContainer = styled.div`
  align-items: center;
  display: flex;
`;
export const BrandingLink = styled.a`
  margin-left: 16px;
`;
export const RecidivizBranding = styled.img``;

export default function Cobranding({ light }) {
  return (
    <BrandingLink href={COBRANDING_URL}>
      <RecidivizBranding
        alt={COBRANDING_ALT}
        src={light ? cobrandingLightSrc : cobrandingSrc}
      />
    </BrandingLink>
  );
}

Cobranding.propTypes = {
  light: PropTypes.bool,
};

Cobranding.defaultProps = {
  light: false,
};
