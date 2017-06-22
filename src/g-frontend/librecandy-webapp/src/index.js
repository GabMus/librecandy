import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import config from './config';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';

injectTapEventPlugin();
const history=createHistory();
ReactDOM.render(
    <Router history={history}><App history={history} apiServer={config.apiServer}/></Router>,
    document.getElementById('root')
);
registerServiceWorker();
