import { mediaQuery } from "@w11r/use-breakpoint";
import styled from "styled-components";
import { THEME } from "../theme";

const HeadingTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 16px;

  ${mediaQuery(["mobile-", THEME.fonts.headingTitleStylesSmall])}
`;

export default HeadingTitle;
