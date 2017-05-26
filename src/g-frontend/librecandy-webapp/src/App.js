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
        this.state = {
            apiServer: props.apiServer,
            userLogged: false,
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
                        <CandyToolbar userLogged={this.state.userLogged}></CandyToolbar>
                        <Switch>
                            <Route exact path='/' component={CandyHomeView} />
                            <Route exact path='/login' component={CandyRegisterOrLogin} />
                            {/*<Route path='/roster' component={Roster}/>
                            <Route path='/schedule' component={Schedule}/>*/}
                        </Switch>
                        {/*<CandyInfiniteScrollPage

                        />*/}

                        {/*}<CandyUserView />*/}

                        {/*}<CandyTreatView
                            treatdescription={'# Asymmetrical drinking vinegar la croix\n\ncardigan cornhole tattooed brooklyn sartorial\n\n`heirloom coloring book put a bird` on it plaid **ethical**\n\n flexitarian truffaut. Sartorial cloud bread bespoke \n\n```\ntypewriter. Taiyaki iceland freegan actually twee mixtape.\nVenmo craft beer chillwave, cronut sartorial\nbespoke offal neutra narwhal\nfour dollar toast hashtag migas ennui actually.\n```\n\n## Skateboard shabby chic everyday carry prism chillwave.\n\n Try-hard pour-over woke, ramps edison bulb health goth cronut semiotics pork belly lomo activated charcoal gochujang flexitarian hoodie jean shorts. Listicle master cleanse quinoa, mlkshk humblebrag williamsburg thundercats affogato marfa yr +1 swag keytar.'}
                            treatscreenshots={['https://www.w3schools.com/w3images/fjords.jpg', 'https://wallpaperbrowse.com/media/images/pictures-2.jpg']}
                        />*/}

                        {/*}<CandyHorizontalCardview
                            label={'What\'s hot'}
                            leftIcon={<SocialWhatshotIcon style={sectionHeaderIconStyle} />}
                        ></CandyHorizontalCardview>
                        <CandyHorizontalCardview
                            label={'Most popular'}
                            leftIcon={<ToggleStarIcon style={sectionHeaderIconStyle} />}
                        ></CandyHorizontalCardview>
                        <CandyHorizontalCardview
                            label={'Latest'}
                            leftIcon={<ActionEventIcon style={sectionHeaderIconStyle} />}
                        ></CandyHorizontalCardview>*/}
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
