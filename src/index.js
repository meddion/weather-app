import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// a tool for reloading the application in the browser without the page refresh
if (module.hot) module.hot.accept();

serviceWorker.unregister();
