import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const WEATHER_API_KEY = 'ecb1854f447242f77eb6007d11745025';
const API_DOMAIN = 'https://api.openweathermap.org/';
const DOMAIN = 'https://openweathermap.org/';

const getObjFirstPropertyName = obj => Object.keys(obj)[0];
const formatDay = day => day;
const formatHour = hour => `${hour}:00`;

const normalizeString = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const kelvinToCelsius = inKelvin =>
  Math.round((inKelvin - 273.15) * 100) / 100;

const currentDate = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${currentDate.getMonth() +
    1}-${currentDate.getDate()}`;
};

const getWeatherApiUrl = city =>
  `${API_DOMAIN}data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}`;

const getImgPathFromCode = code => `${DOMAIN}img/wn/${code}@2x.png`;

const setStateDataCallback = results => ({ data, searchTerm }) => {
  const targetDay = getObjFirstPropertyName(results);
  const targetHour = getObjFirstPropertyName(results[targetDay]);
  return {
    data: {
      ...data,
      [searchTerm]: results
    },
    target: {
      term: searchTerm,
      day: targetDay,
      hour: targetHour
    },
    isLoading: false
  };
};

class App extends Component {
  state = {
    searchTerm: '',
    target: {
      term: null,
      day: null,
      hour: null
    },
    data: null,
    isError: null,
    isLoading: false
  };

  fetchDataByTerm = async searchTerm => {
    this.setState({ isLoading: true });
    try {
      const response = await axios(getWeatherApiUrl(searchTerm));
      this.setData(this.cleanUpFetchedData(response.data.list));
    } catch (e) {
      console.log(e.message);
      this.setError();
    }
  };

  cleanUpFetchedData = dirtyData => {
    const currentDay = currentDate();
    const currentHour = new Date().getHours();
    return dirtyData.reduce(
      (result, { dt_txt, main, clouds, wind, weather }) => {
        let [day, hour] = dt_txt.split(' ');
        hour = parseInt(hour); // in order to store it later

        // filters an outdated data
        if (day === currentDay && hour + 1 > currentHour)
          return result;

        const { temp, pressure, humidity } = main;
        const { all: cloudiness } = clouds; // in %
        const { speed: windSpeed } = wind;
        const {
          main: brief,
          description: detailed,
          icon: iconCode
        } = weather[0]; // description of the weather

        if (!result[day]) result[day] = {};

        result[day][hour] = {
          temp: kelvinToCelsius(temp),
          description: { brief, detailed, iconCode },
          rest: {
            cloudiness,
            windSpeed,
            pressure,
            humidity
          }
        };

        return result;
      },
      {}
    );
  };

  setData = results => this.setState(setStateDataCallback(results));

  setError = () => this.setState({ isError: true, isLoading: false });

  onSubmitSearch = e => {
    e.preventDefault();

    this.setState({ isError: false });

    const { data, searchTerm } = this.state;
    if (searchTerm) {
      if (!data || !data[searchTerm])
        this.fetchDataByTerm(searchTerm);
      // to do: add caching
    }
  };

  onChangeSearch = e =>
    this.setState({ searchTerm: normalizeString(e.target.value) });

  setTargetHour = hour =>
    this.setState({
      target: {
        ...this.state.target,
        hour
      }
    });

  setTargetDayAndHour = (day, hour) =>
    this.setState({
      target: {
        ...this.state.target,
        day,
        hour
      }
    });

  render() {
    const {
      searchTerm,
      target,
      data,
      isLoading,
      isError
    } = this.state;
    const { term, day, hour } = target;

    const input = {
      weatherData: term && day && hour && data[term]
    };

    if (input.weatherData) {
      input.time = {
        day,
        hour
      };
      input.place = term;
    }

    //console.log(input);
    return (
      <div className="App">
        <Search
          onSubmit={this.onSubmitSearch}
          onChange={this.onChangeSearch}
          value={searchTerm}
        >
          Send
        </Search>

        <AdvancedWindow
          isLoading={isLoading}
          isError={isError}
          input={input}
          setTargetHour={this.setTargetHour}
          setTargetDayAndHour={this.setTargetDayAndHour}
        />
      </div>
    );
  }
}

const Search = ({ onSubmit, onChange, value, children }) => {
  return (
    <div id="search">
      <form onSubmit={onSubmit}>
        <input value={value} onChange={onChange} type="text" />
        <button type="submit">{children}</button>
      </form>
    </div>
  );
};

const Window = ({ input, setTargetDayAndHour, setTargetHour }) => {
  const { time, place, weatherData } = input;
  const { day, hour } = time;
  const { description, rest, temp } = weatherData[day][hour];
  const { brief, detailed, iconCode } = description;
  const { cloudiness, windSpeed, pressure, humidity } = rest;

  const hoursArray = Object.keys(weatherData[day]);

  return (
    <div id="window">
      <div id="main">
        <span id="place">{place}</span>
        <span id="time">
          {formatDay(day)} , {formatHour(hour)}
        </span>
        <span id="details">
          <h1>{brief}</h1>
          {detailed}
        </span>
        <span id="img">
          <img src={getImgPathFromCode(iconCode)} alt={brief} />
        </span>
        <span id="temp">{temp}</span>
        <span id="other-info">
          <ul>
            <li>Wind: {windSpeed} m/s</li>
            <li>Pressure: {pressure} Pa</li>
            <li>Cloudiness: {cloudiness} %</li>
            <li>Humidity: {humidity} %</li>
          </ul>
        </span>

        <HourList
          currentHour={hour}
          hoursArray={hoursArray}
          setTargetHour={setTargetHour}
        />
      </div>

      <DaysList
        currentDay={day}
        weatherData={weatherData}
        setTargetDayAndHour={setTargetDayAndHour}
      />
    </div>
  );
};

const HourList = ({ hoursArray, setTargetHour }) => (
  <div className="list">
    {hoursArray.map(hour => (
      <button
        onClick={() => setTargetHour(hour)}
        key={hour}
        type="button"
      >
        {formatHour(hour)}
      </button>
    ))}
  </div>
);

const DaysList = ({
  currentDay,
  weatherData,
  setTargetDayAndHour
}) => (
  <div className="list">
    {Object.keys(weatherData).map(key => {
      const firstPropertyName = getObjFirstPropertyName(
        weatherData[key]
      );
      const iconCode =
        weatherData[key][firstPropertyName].description.iconCode;
      const formatedDay = formatDay(currentDay);
      const currentActive = currentDay === key;
      return (
        <button
          className={currentActive ? 'active' : ''}
          onClick={() =>
            !currentActive &&
            setTargetDayAndHour(key, firstPropertyName)
          }
          type="button"
          key={key}
        >
          <img src={getImgPathFromCode(iconCode)} alt={formatedDay} />
          {formatedDay}
        </button>
      );
    })}
  </div>
);

const withInputValidation = Component => props =>
  props.input.weatherData && <Component {...props} />;

const withErrorChecking = Component => ({ isError, ...rest }) => (
  <div>
    {isError && (
      <div className="interactions">
        <span className="error">
          Sorry, couldn't find the city you have asked.
        </span>
      </div>
    )}

    <Component {...rest} />
  </div>
);

const withLoading = Component => ({ isLoading, ...rest }) => (
  <div>
    {isLoading && (
      <div className="interactions">
        <span className="loading">Loading...</span>
      </div>
    )}

    <Component {...rest} />
  </div>
);

const AdvancedWindow = withInputValidation(
  withErrorChecking(withLoading(Window))
);

export default App;
