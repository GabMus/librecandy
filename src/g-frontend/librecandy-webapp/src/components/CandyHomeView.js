import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import CandyToolbar from './CandyToolbar';

// tmp
import CandyTreatCard from './CandyTreatCard';
//tmp
import CandyTreatView from './CandyTreatView';
//tmp
import CandyRegisterOrLogin from './CandyRegisterOrLogin';
//tmp
import CandyHorizontalCardview from './CandyHorizontalCardview';
import CandyUserView from './CandyUserView';
//import CandyUserCard from './components/CandyUserCard';
import CandyInfiniteScrollPage from './CandyInfiniteScrollPage';

import SocialWhatshotIcon from 'material-ui/svg-icons/social/whatshot';
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star';
import ActionEventIcon from 'material-ui/svg-icons/action/event';

class CandyHomeView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            apiServer: props.apiServer,
            userLogged: false,
            latestTreats: [],
            mostratedTreats: [],
            hotTreats: [],
            userToken: this.props.userToken
        };
    }

    componentDidMount() { // called when the rendering is done
        //fetch(this.)
        let headers = {
            'Access-Control-Allow-Origin':'*',
        };
        if (this.state.userToken) {
            headers['Authorization'] = `JWT ${this.state.userToken}`;
        }
        let request = {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        };
        fetch(`${this.props.apiServer}/treats?limit=5&offset=0`, request)
            .then(response => {
                //console.log(response);
                if (response.ok) {
                    return response.json();
                }
                else {
                    return response;
                }
            })
            .then(data => {
                if (data.status) {
                    console.log('Error');
                }
                else {
                    this.setState({latestTreats: data.treats});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
        fetch(`${this.props.apiServer}/treats/orderby/rating?limit=5&offset=0`, request)
            .then(response => {
                //console.log(response);
                if (response.ok) {
                    return response.json();
                }
                else {
                    return response;
                }
            })
            .then(data => {
                if (data.status) {
                    console.log('Error');
                }
                else {
                    this.setState({mostratedTreats: data.treats});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
        fetch(`${this.props.apiServer}/treats?limit=5&offset=0`, request) // TODO: implement HOT request
            .then(response => {
                //console.log(response);
                if (response.ok) {
                    return response.json();
                }
                else {
                    return response;
                }
            })
            .then(data => {
                if (data.status) {
                    console.log('Error');
                }
                else {
                    this.setState({hotTreats: data.treats});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
    }

    render() {

        let sectionHeaderIconStyle = {
            width: '48px',
            height: '48px',
            float: 'left',
            marginRight: '12px'
        };
        return (
            <div className='CandyHomeView'>
                <div>
                    <CandyHorizontalCardview
                        treats={this.state.hotTreats}
                        label={'What\'s hot'}
                        leftIcon={
                            <SocialWhatshotIcon
                                style={sectionHeaderIconStyle}
                            />
                        }
                    ></CandyHorizontalCardview>
                    <CandyHorizontalCardview
                        treats={this.state.mostratedTreats}
                        label={'Most popular'}
                        leftIcon={
                            <ToggleStarIcon
                                style={sectionHeaderIconStyle}
                            />
                        }
                    ></CandyHorizontalCardview>
                    <CandyHorizontalCardview
                        treats={this.state.latestTreats}
                        label={'Latest'}
                        leftIcon={
                            <ActionEventIcon
                                style={sectionHeaderIconStyle}
                            />
                        }
                    ></CandyHorizontalCardview>
                </div>
            </div>
        );
    }
}

export default CandyHomeView;
