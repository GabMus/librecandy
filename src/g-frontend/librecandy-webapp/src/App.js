import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    pink300,
    tealA400,
    tealA200,
    teal700,
    darkBlack,
    white,
    grey600
} from 'material-ui/styles/colors';

import CandyToolbar from './components/CandyToolbar';

import CandyCreateTreat from './components/CandyCreateTreat';
// tmp
import CandyTreatCard from './components/CandyTreatCard';
//tmp
import CandyTreatView from './components/CandyTreatView';
//tmp
import CandyRegisterOrLogin from './components/CandyRegisterOrLogin';
//tmp
import CandyHorizontalCardview from './components/CandyHorizontalCardview';
import CandyUserView from './components/CandyUserView';
//import CandyUserCard from './components/CandyUserCard';
import CandyInfiniteScrollPage from './components/CandyInfiniteScrollPage';
import Candy404 from './components/Candy404';

import SocialWhatshotIcon from 'material-ui/svg-icons/social/whatshot';
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star';
import ActionEventIcon from 'material-ui/svg-icons/action/event';

import CandyHomeView from './components/CandyHomeView';

import { Switch, Route } from 'react-router-dom'

const candyTheme = getMuiTheme({
    palette: {
        primary1Color: pink300,
        accent1Color: tealA400,
        accent2Color: tealA200,
        accent3Color: teal700,
        textColor: darkBlack,
        alternateTextColor: white,
        iconGrey: grey600
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.getCookie = (cname) => {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        };
        this.state = {
            apiServer: props.apiServer,
            userToken: this.getCookie('JWT_AUTH'),
        };
    }

    componentDidMount() { // called when the rendering is done
        //fetch(this.)
    }

    render() {

        let sectionHeaderIconStyle = {
            width: '48px',
            height: '48px',
            float: 'left',
            marginRight: '12px'
        };
        return (
            <div className='App'>
                <MuiThemeProvider muiTheme={candyTheme}>
                    <div>
                        <CandyToolbar userToken={this.state.userToken}></CandyToolbar>
                        <Switch>
                            <Route exact path='/' component={
                                () => <CandyHomeView
                                    userToken={this.state.userToken}
                                    apiServer={this.props.apiServer} />
                            } />
                            <Route exact path='/login' component={
                                () => <CandyRegisterOrLogin
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer} />
                            } />
                            <Route exact path='/newtreat' component={
                                () => <CandyCreateTreat
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer} />
                            } />
                            <Route exact path={`/treat/:pkgname`} component={
                                (params) => <CandyTreatView {...params}
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer} />
                            } />
                            <Route exact path={`/users/:username`} component={
                                (params) => <CandyUserView {...params}
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer} />
                            } />
                            <Route exact path={`/treats/mostpopular`} component={
                                () => <CandyInfiniteScrollPage
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer}
                                    fetchurl='/treats/orderby/rating'
                                    label='Most Popular' />
                            } />
                            <Route exact path={`/treats/latest`} component={
                                () => <CandyInfiniteScrollPage
                                    userToken={this.state.userToken}
                                    apiServer={this.state.apiServer}
                                    fetchurl='/treats'
                                    label='Latest' />
                            } />
                            <Route exact path={`/*`} component={
                                () => <Candy404 />
                            } />
                        </Switch>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
