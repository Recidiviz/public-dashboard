import styled, { css } from "styled-components";

const PILL_HEIGHT = 32;

export const controlTypeProperties = css`
  font: ${(props) => props.theme.fonts.body};
  font-size: 10px;
`;

export const ControlContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${PILL_HEIGHT}px;
  margin-left: 32px;
`;

export const ControlLabel = styled.span`
  color: ${(props) => props.theme.colors.controlLabel};
  display: inline-block;
  font: ${(props) => props.theme.fonts.bodyBold};
  font-size: 10px;
  margin-right: 8px;
`;

export const ControlValue = styled.span`
  ${controlTypeProperties}
  align-items: center;
  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: ${PILL_HEIGHT / 2}px;
  color: ${(props) => props.theme.colors.controlValue};
  display: inline-flex;
  height: ${PILL_HEIGHT}px;
  justify-content: center;
  min-width: ${PILL_HEIGHT * 1.5}px;
  padding: 8px ${PILL_HEIGHT / 2}px;
`;
