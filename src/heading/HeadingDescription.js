import styled from "styled-components";

const HeadingDescription = styled.div`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 24px;
`;

export default HeadingDescription;
