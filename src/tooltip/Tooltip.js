const { default: styled } = require("styled-components");

const Tooltip = styled.div`
  background: ${(props) => props.theme.colors.tooltipBackground};
  border-radius: 4px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  color: ${(props) => props.theme.colors.bodyLight};
  font: ${(props) => props.theme.fonts.body};
  padding: 12px;
  z-index: ${(props) => props.theme.zIndex.tooltip};
`;

export default Tooltip;
