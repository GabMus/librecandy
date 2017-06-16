import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import config from './config';
import {BrowserRouter} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

injectTapEventPlugin();
const history=createHistory();
ReactDOM.render(
    <BrowserRouter history={history}><App history={history} apiServer={config.apiServer}/></BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();
