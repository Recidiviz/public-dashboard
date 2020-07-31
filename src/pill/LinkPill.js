import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { PillContainer, PillValue } from "./shared";

const LinkPillContainer = styled(PillContainer)``;

const LinkPillLink = styled.a`
  text-decoration: none;
`;

const LinkPillValue = styled(PillValue)``;

export default function LinkControl(props) {
  const { children, ...linkProps } = props;

  return (
    <LinkPillContainer>
      <LinkPillLink {...linkProps}>
        <LinkPillValue>{children}</LinkPillValue>
      </LinkPillLink>
    </LinkPillContainer>
  );
}

LinkControl.propTypes = {
  children: PropTypes.node.isRequired,
};
