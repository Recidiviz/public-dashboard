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
  font-size: 14px;
  padding: 16px;
  z-index: ${(props) => props.theme.zIndex.tooltip};

  .InfoPanel & {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow-x: auto;
    padding: 0 32px 32px;
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
    align-items: flex-end;
    display: flex;
  }
`;
const TooltipRecord = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .InfoPanel & {
    font: ${(props) => props.theme.fonts.displayMedium};
    font-size: 24px;
    margin-right: 24px;
    margin-bottom: 0;
  }
`;
const TooltipLabel = styled.div`
  .InfoPanel & {
    font: ${(props) => props.theme.fonts.body};
    font-size: 16px;
    opacity: 0.6;
  }
`;
const TooltipValue = styled.div`
  display: inline-block;

  .InfoPanel & {
    display: block;
  }
`;
const TooltipPct = styled.div`
  display: inline-block;
  margin-left: 8px;

  &::before {
    content: "(";
  }

  &::after {
    content: ")";
  }

  .InfoPanel & {
    display: block;
    margin-left: 0;

    &::before,
    &::after {
      content: "";
    }
  }
`;

export const Tooltip = ({ title, records }) => {
  return (
    <TooltipWrapper>
      <TooltipTitle>{title}</TooltipTitle>
      <TooltipRecordList>
        {records.map(({ label, value, pct }, i) => (
          <TooltipRecord key={label || i}>
            {label && <TooltipLabel>{label}</TooltipLabel>}
            <TooltipValue>
              {typeof value === "number" ? formatAsNumber(value) : value}
            </TooltipValue>
            {pct !== undefined && <TooltipPct>{formatAsPct(pct)}</TooltipPct>}
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
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      pct: PropTypes.number,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Tooltip;
