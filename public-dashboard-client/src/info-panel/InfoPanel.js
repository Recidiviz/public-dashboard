import useBreakpoint from "@w11r/use-breakpoint";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { ReactComponent as MenuOpenIcon } from "../assets/icons/menuOpen.svg";
import { useInfoPanelDispatch } from "./InfoPanelContext";

const InfoPanelWrapper = styled.div`
  background: ${(props) => props.theme.colors.tooltipBackground};
  border-radius: 0;
  bottom: 0;
  left: 0;
  padding-top: 8px;
  position: fixed;
  right: 0;
  z-index: ${(props) => props.theme.zIndex.modal};
`;

const InfoPanelOverlay = styled.div`
  background: ${(props) => props.theme.colors.tooltipBackground};
  bottom: 0;
  left: 0%;
  opacity: 0.1;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${(props) => props.theme.zIndex.modal};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 24px;

  rect {
    fill: ${(props) => props.theme.colors.bodyLight} !important;
  }
`;

const ICON_SIZE = 16;

export default function InfoPanel({ data, renderContents }) {
  const enabled = useBreakpoint(false, ["mobile-", true]);
  const infoPanelDispatch = useInfoPanelDispatch();

  const dismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    infoPanelDispatch({ type: "clear" });
  };

  if (enabled && data && renderContents) {
    return (
      <>
        <InfoPanelOverlay onClick={dismiss} />
        <InfoPanelWrapper className="InfoPanel">
          <CloseButtonWrapper>
            <CloseButton onClick={dismiss}>
              <MenuOpenIcon width={ICON_SIZE} height={ICON_SIZE} />
            </CloseButton>
          </CloseButtonWrapper>
          {renderContents(data)}
        </InfoPanelWrapper>
      </>
    );
  }
  return null;
}

InfoPanel.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  renderContents: PropTypes.func,
};

InfoPanel.defaultProps = {
  data: undefined,
  renderContents: undefined,
};
