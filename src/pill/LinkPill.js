import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { PillContainer, PillValue } from "./shared";

const LinkPillContainer = styled(PillContainer)``;

const LinkPillLink = styled.a`
  text-decoration: none;
`;

const LinkPillValue = styled(PillValue)``;

export default function LinkControl({ href, children }) {
  return (
    <LinkPillContainer>
      <LinkPillLink href={href}>
        <LinkPillValue>{children}</LinkPillValue>
      </LinkPillLink>
    </LinkPillContainer>
  );
}

LinkControl.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};
