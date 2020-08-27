import { mediaQuery } from "@w11r/use-breakpoint";
import styled from "styled-components";

const HeadingTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 16px;

  ${mediaQuery([
    "mobile-",
    `
      font-size: 28px;
      letter-spacing: -0.015em;
      line-height: 1;
    `,
  ])}
`;

export default HeadingTitle;
