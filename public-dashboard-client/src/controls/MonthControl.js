import { Slider, Track, Thumb } from "@accessible/slider";
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
  background: ${(props) => props.theme.colors.sliderThumb};
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

const MonthControlValue = styled(ControlValue)`
  white-space: nowrap;
  width: 80px;
`;

const monthNames = [
  null,
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonthValue = (monthStr) => {
  const [year, month] = monthStr.split("-");
  return `${monthNames[month]} ${year}`;
};

export default function MonthControl({ onChange, months }) {
  const maxSliderValue = months.length - 1;

  const [monthIndex, setMonthIndex] = useState(maxSliderValue);

  useEffect(() => {
    onChange(months[monthIndex]);
  }, [monthIndex, months, onChange]);

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
      <MonthControlValue>
        {formatMonthValue(months[monthIndex])}
      </MonthControlValue>
    </ControlContainer>
  );
}

MonthControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
};
