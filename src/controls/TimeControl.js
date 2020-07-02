import { Slider, Track, Thumb } from "@accessible/slider";
import { eachMonthOfInterval, format } from "date-fns";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { ControlContainer, ControlLabel, ControlValue } from "./shared";

const TRACK_WIDTH = 6;
const SliderTrack = styled.div`
  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: ${TRACK_WIDTH / 2}px;
  height: ${TRACK_WIDTH}px;
  width: 100%;
`;

const THUMB_SIZE = 10;
const SliderThumb = styled.div`
  background: ${(props) => props.theme.colors.darkGreen};
  border-radius: ${THUMB_SIZE / 2}px;
  height: ${THUMB_SIZE}px;
  margin-top: -${THUMB_SIZE / 2 - TRACK_WIDTH / 2}px;
  margin-left: -${THUMB_SIZE / 2}px;
  width: ${THUMB_SIZE}px;
`;

const SliderContainer = styled.div`
  align-items: center;
  display: flex;
  margin-left: ${THUMB_SIZE / 2}px;
  margin-right: ${THUMB_SIZE / 2 + 8}px;
  width: 175px;

  /* these properties are a little obscure but they are
  what is provided by @accessible/slider to know when the handle
  is being dragged or operated by keyboard */
  &:active ${SliderThumb}, [type="range"]:focus + & ${SliderThumb} {
    background: ${(props) => props.theme.colors.highlight};
  }
`;

const TimeControlValue = styled(ControlValue)`
  white-space: nowrap;
  width: 80px;
`;

export default function TimeControl({ startDate, endDate, onChange }) {
  const [months, setMonths] = useState(
    eachMonthOfInterval({ start: startDate, end: endDate })
  );
  const maxSliderValue = months.length - 1;

  const [monthIndex, setMonthIndex] = useState(maxSliderValue);

  useEffect(() => {
    onChange(months[monthIndex]);
  }, [monthIndex, months, onChange]);

  useEffect(() => {
    setMonths(eachMonthOfInterval({ start: startDate, end: endDate }));
  }, [endDate, startDate]);

  return (
    <ControlContainer>
      <ControlLabel>Date</ControlLabel>
      <Slider
        min={0}
        max={maxSliderValue}
        defaultValue={maxSliderValue}
        onChange={setMonthIndex}
      >
        <SliderContainer>
          <Track>
            <SliderTrack>
              <Thumb>
                <SliderThumb />
              </Thumb>
            </SliderTrack>
          </Track>
        </SliderContainer>
      </Slider>
      <TimeControlValue>
        {format(months[monthIndex], "MMM yyyy")}
      </TimeControlValue>
    </ControlContainer>
  );
}

TimeControl.propTypes = {
  endDate: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
};
