import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import config from './config';

injectTapEventPlugin();

ReactDOM.render(<App apiServer={config.apiServer}/>, document.getElementById('root'));
registerServiceWorker();
