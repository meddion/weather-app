const WEATHER_API_KEY = 'ecb1854f447242f77eb6007d11745025';

const getWeatherApiUrl = city =>
  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}`;

const getImgPathFromCode = code =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;

const getFirstFieldNameInObj = obj => Object.keys(obj)[0];
const formatDayForView = day => {
  const [aYear, aMonth, aDay] = day.split('-');
  return `${aDay}.${aMonth}.${aYear}`;
};
const formatHourForView = hour => `${hour}:00`;

const normalizeUserInput = input =>
  input
    .toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

const convertKelvinsToCelsius = tempInKelvins =>
  Math.round((tempInKelvins - 273.15) * 100) / 100;

const getCurrentDate = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${currentDate.getMonth() +
    1}-${currentDate.getDate()}`;
};

const getCurrentHour = () => new Date().getHours();

const getFormattedFetchedData = dirtyData => {
  const currentDay = getCurrentDate();
  const currentHour = getCurrentHour();
  return dirtyData.reduce((result, { dt_txt, main, clouds, wind, weather }) => {
    let [day, hour] = dt_txt.split(' ');
    hour = parseInt(hour); // to store it as an obj field

    // filters an outdated data
    if (day === currentDay && hour + 1 > currentHour) return result;

    const { temp, pressure, humidity } = main;
    const { all: cloudiness } = clouds; // in %
    const { speed: windSpeed } = wind;
    const { main: brief, description: detailed, icon: iconCode } = weather[0]; // description of the weather

    if (!result[day]) result[day] = {};

    result[day][hour] = {
      temp: convertKelvinsToCelsius(temp),
      description: { brief, detailed, iconCode },
      rest: {
        cloudiness,
        windSpeed,
        pressure,
        humidity
      }
    };

    return result;
  }, {});
};

const forecastDataSetter = newData => ({ forecastData, searchTerm }) => {
  const day = getFirstFieldNameInObj(newData);
  const hour = getFirstFieldNameInObj(newData[day]);
  return {
    forecastData: {
      ...forecastData,
      [searchTerm]: newData
    },
    target: {
      term: searchTerm,
      day,
      hour
    },
    isLoading: false
  };
};

export {
  getWeatherApiUrl,
  getImgPathFromCode,
  getFirstFieldNameInObj,
  formatDayForView,
  formatHourForView,
  getCurrentDate,
  getCurrentHour,
  normalizeUserInput,
  convertKelvinsToCelsius,
  getFormattedFetchedData,
  forecastDataSetter
};
