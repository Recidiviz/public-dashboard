import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { PillContainer, PillValue } from "../pill";

export const controlTypeProperties = css`
  font-size: 13px;
`;

export const ControlContainer = styled(PillContainer)`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }
`;

export const ControlLabel = styled.span`
  color: ${(props) => props.theme.colors.controlLabel};
  display: inline-block;
  font: ${(props) => props.theme.fonts.bodyBold};
  font-size: 13px;
  margin-right: 8px;
`;

export const ControlValue = styled(PillValue)``;

export const DropdownOptionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});
