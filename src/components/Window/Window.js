import React from 'react';
import './Window.css';
import { DaysTable, HourTable } from '../Table';

import {
  formatDayForView,
  formatHourForView,
  getImgPathFromCode
} from '../../helpers';

const Window = ({
  target,
  forecastDataByCity,
  setTargetHour,
  setTargetDayAndHour
}) => {
  const { term: place, day, hour } = target;
  const { description, rest, temp } = forecastDataByCity[day][hour];
  const { brief, detailed, iconCode } = description;
  const { cloudiness, windSpeed, pressure, humidity } = rest;

  const hoursArray = Object.keys(forecastDataByCity[day]);

  return (
    <div className="Window">
      <div className="MainContent">
        <div className="place">{place}</div>
        <div className="time">
          {formatDayForView(day)}, {formatHourForView(hour)}
        </div>
        <div className="details">
          <div className="brief">
            {brief}
            <img src={getImgPathFromCode(iconCode)} alt={brief} />
          </div>
          <div className="detailed">{detailed}</div>
        </div>

        <div className="otherInfo">
          <ul>
            <li className="temp">Temp: {temp} °C</li>
            <li>Wind: {windSpeed} m/s</li>
            <li>Pressure: {pressure} Pa</li>
            <li>Cloudiness: {cloudiness} %</li>
            <li>Humidity: {humidity} %</li>
          </ul>
        </div>
      </div>

      <HourTable
        hoursArray={hoursArray}
        currentHour={hour}
        setTargetHour={setTargetHour}
      />

      <DaysTable
        forecastDataByCity={forecastDataByCity}
        currentDay={day}
        setTargetDayAndHour={setTargetDayAndHour}
      />
    </div>
  );
};

export default Window;
