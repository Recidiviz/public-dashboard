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
  hidden: PropTypes.bool,
});

export const DropdownWrapper = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.control};

  &.Dropdown--highlighted {
    ${ControlValue} {
      background: ${(props) => props.theme.colors.highlight};
      color: ${(props) => props.theme.colors.bodyLight};
    }
  }
`;

export const DropdownMenu = styled.div`
  ${controlTypeProperties}

  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: 15px;
  list-style: none;
  padding: 12px 0;
  position: relative;
  white-space: nowrap;
  z-index: ${(props) => props.theme.zIndex.menu};
`;

export const DropdownMenuItem = styled.div`
  cursor: pointer;
  padding: 6px 18px;
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};

  /*
    because we use multiple dropdown libraries that represent menu UI states
    in different ways, taking a selector as a prop lets us target highlight state generically
  */
  &:hover${(props) =>
      props.highlightedSelector ? `, ${props.highlightedSelector}` : ""} {
    background: ${(props) => props.theme.colors.highlight};
    color: ${(props) => props.theme.colors.bodyLight};
  }
`;

export const HiddenSelect = styled.select`
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;
