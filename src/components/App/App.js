import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Search from '../Search';
import { AdvancedWindow } from '../Window';
import {
  getWeatherApiUrl,
  getFirstFieldNameInObj,
  normalizeUserInput,
  getFormattedFetchedData,
  forecastDataSetter
} from '../../helpers';

class App extends Component {
  state = {
    searchTerm: '',
    target: {
      term: null,
      day: null,
      hour: null
    },
    forecastData: null,
    isError: null,
    isLoading: false
  };

  fetchAndSetDataByTerm = async searchTerm => {
    this.setState({ isLoading: true });
    try {
      const response = await axios(getWeatherApiUrl(searchTerm));
      const newForecastData = getFormattedFetchedData(response.data.list);
      this.setForecastData(newForecastData);
    } catch (e) {
      console.log(e.message);
      this.setError();
    }
  };

  setForecastData = newData => this.setState(forecastDataSetter(newData));

  setTargetDayAndHour = (day, hour) =>
    this.setState(prevState => {
      return {
        target: {
          ...prevState.target,
          day,
          hour
        }
      };
    });

  setTargetHour = hour =>
    this.setState(prevState => {
      return {
        target: {
          ...prevState.target,
          hour
        }
      };
    });

  setTargetTerm = term =>
    this.setState(prevState => {
      return {
        target: {
          ...prevState.target,
          term
        }
      };
    });

  setError = () => this.setState({ isError: true, isLoading: false });

  onSubmitSearch = e => {
    e.preventDefault();
    this.setState({ isError: false });
    const { forecastData, searchTerm } = this.state;
    if (!searchTerm) return;

    if (forecastData && forecastData[searchTerm]) {
      const targetDay = getFirstFieldNameInObj(forecastData[searchTerm]);
      const targetHour = getFirstFieldNameInObj(
        forecastData[searchTerm][targetDay]
      );
      this.setTargetTerm(searchTerm);
      this.setTargetDayAndHour(targetDay, targetHour);
    } else {
      this.fetchAndSetDataByTerm(searchTerm);
    }
  };

  onChangeSearch = e =>
    this.setState({ searchTerm: normalizeUserInput(e.target.value) });

  render() {
    const { searchTerm, target, forecastData, isLoading, isError } = this.state;
    const { term, day, hour } = target;
    const forecastDataByCity = term && day && hour && forecastData[term];

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
          forecastDataByCity={forecastDataByCity}
          target={target}
          setTargetHour={this.setTargetHour}
          setTargetDayAndHour={this.setTargetDayAndHour}
        />
      </div>
    );
  }
}

export default App;
