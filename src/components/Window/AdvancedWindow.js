import React from 'react';
import Window from './Window';
import './AdvancedWindow.css';

const withInputValidation = Component => props =>
  props.forecastDataByCity && <Component {...props} />;

const withErrorChecking = Component => ({ isError, ...rest }) => (
  <div>
    {isError && (
      <div className="error">
        Sorry, couldn't find the city you have asked :(
      </div>
    )}
    <Component {...rest} />
  </div>
);

const withLoading = Component => ({ isLoading, ...rest }) => (
  <div>
    {isLoading && <div className="loading">Loading...</div>}
    <Component {...rest} />
  </div>
);

const AdvancedWindow = withErrorChecking(
  withLoading(withInputValidation(Window))
);

export default AdvancedWindow;
