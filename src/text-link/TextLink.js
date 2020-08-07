import styled from "styled-components";
import { hoverColor } from "../utils";

const TextLink = styled.a`
  color: ${(props) => props.theme.colors.highlight};
  text-decoration: underline;
  transition: color ${(props) => props.theme.transition.defaultTimeSettings};

  &:hover {
    color: ${(props) => hoverColor(props.theme.colors.highlight)};
  }
`;

export default TextLink;
