import { mediaQuery } from "@w11r/use-breakpoint";
import styled from "styled-components";

const PADDING_LARGE = "80px";
const PADDING_SMALL = "8px";

const PageWidthContainer = styled.div`
  max-width: 1792px;
  padding-left: ${PADDING_LARGE};
  padding-right: ${PADDING_LARGE};

  ${mediaQuery([
    "tablet-",
    `padding-left ${PADDING_SMALL}; padding-right: ${PADDING_SMALL}`,
  ])}
`;

export default PageWidthContainer;
