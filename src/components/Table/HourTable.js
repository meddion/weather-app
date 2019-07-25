import React from 'react';
import './HourTable.css';
import { formatHourForView } from '../../helpers';

const HourTable = ({ hoursArray, currentHour, setTargetHour }) => (
  <div className="HourTable">
    {hoursArray.map(hour => (
      <button
        className={currentHour === hour ? 'active' : ''}
        type="button"
        onClick={() => setTargetHour(hour)}
        key={hour}
      >
        {formatHourForView(hour)}
      </button>
    ))}
  </div>
);

export default HourTable;
