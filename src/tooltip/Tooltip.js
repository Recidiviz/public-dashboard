import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { formatAsPct, formatAsNumber } from "../utils";

const TooltipWrapper = styled.div`
  background: ${(props) => props.theme.colors.tooltipBackground};
  border-radius: 4px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  color: ${(props) => props.theme.colors.bodyLight};
  font: ${(props) => props.theme.fonts.body};
  padding: 16px;
  padding-bottom: 8px;
  z-index: ${(props) => props.theme.zIndex.tooltip};

  .InfoPanel & {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow-x: auto;
    padding: 0 32px 16px;
    width: 100%;
  }
`;

const TooltipTitle = styled.div`
  color: ${(props) => props.theme.colors.infoPanelTitle};

  .InfoPanel & {
    margin-bottom: 24px;
  }
`;
const TooltipRecordList = styled.div`
  .InfoPanel & {
    display: flex;
  }
`;
const TooltipRecord = styled.div`
  margin-bottom: 16px;

  .InfoPanel & {
    font: ${(props) => props.theme.fonts.displayMedium};
    font-size: 24px;
    margin-right: 24px;
  }
`;
const TooltipLabel = styled.div`
  .InfoPanel & {
    font: ${(props) => props.theme.fonts.body};
    font-size: 16px;
    opacity: 0.6;
  }
`;
const TooltipValue = styled.div``;
const TooltipPct = styled.div``;

export const Tooltip = ({ title, records }) => {
  return (
    <TooltipWrapper>
      <TooltipTitle>{title}</TooltipTitle>
      <TooltipRecordList>
        {records.map(({ label, value, pct }, i) => (
          <TooltipRecord key={label || i}>
            {label && <TooltipLabel>{label}</TooltipLabel>}
            <TooltipValue>{formatAsNumber(value)}</TooltipValue>
            {pct && <TooltipPct>{formatAsPct(pct)}</TooltipPct>}
          </TooltipRecord>
        ))}
      </TooltipRecordList>
    </TooltipWrapper>
  );
};

Tooltip.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number.isRequired,
      pct: PropTypes.number,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Tooltip;
