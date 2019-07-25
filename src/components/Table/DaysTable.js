import React from 'react';
import './DaysTable.css';
import {
  getFirstFieldNameInObj,
  formatDayForView,
  getImgPathFromCode
} from '../../helpers';

const DaysTable = ({ forecastDataByCity, currentDay, setTargetDayAndHour }) => (
  <div className="DaysTable">
    {Object.keys(forecastDataByCity).map(targetDay => {
      const targetHour = getFirstFieldNameInObj(forecastDataByCity[targetDay]);
      const iconCode =
        forecastDataByCity[targetDay][targetHour].description.iconCode;
      const formatedDay = formatDayForView(targetDay);
      const currentActive = currentDay === targetDay;
      return (
        <button
          type="button"
          key={targetDay}
          className={currentActive ? 'active' : ''}
          onClick={() =>
            !currentActive && setTargetDayAndHour(targetDay, targetHour)
          }
        >
          {formatedDay}
          <img src={getImgPathFromCode(iconCode)} alt={formatedDay} />
        </button>
      );
    })}
  </div>
);

export default DaysTable;
