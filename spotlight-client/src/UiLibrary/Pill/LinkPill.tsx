import React from "react";
import styled from "styled-components/macro";

import { PillContainer, PillValue } from "./shared";

const LinkPillContainer = styled(PillContainer)``;

const LinkPillLink = styled.a`
  text-decoration: none;
`;

const LinkPillValue = styled(PillValue)``;

/**
 * HTML link component styled like a `Pill`. Props other than `children`
 * will be passed on to a `styled.a` component.
 */
const LinkPill: React.FC = (props) => {
  const { children, ...linkProps } = props;

  return (
    <LinkPillContainer>
      <LinkPillLink {...linkProps}>
        <LinkPillValue>{children}</LinkPillValue>
      </LinkPillLink>
    </LinkPillContainer>
  );
};

export default LinkPill;
