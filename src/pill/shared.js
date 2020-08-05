import styled from "styled-components";

const PILL_HEIGHT = 40;

export const PillContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${PILL_HEIGHT}px;
`;

export const PillValue = styled.span`
  align-items: center;
  background: ${(props) => props.theme.colors.pillBackground};
  border-radius: ${PILL_HEIGHT / 2}px;
  color: ${(props) => props.theme.colors.pillValue};
  display: inline-flex;
  font: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  height: ${PILL_HEIGHT}px;
  justify-content: center;
  min-width: ${PILL_HEIGHT * 1.5}px;
  padding: 8px ${PILL_HEIGHT / 2}px;
  transition: background-color
    ${(props) => props.theme.transition.defaultTimeSettings};

  &:hover {
    background: ${(props) => props.theme.colors.pillBackgroundHover};
  }
`;
