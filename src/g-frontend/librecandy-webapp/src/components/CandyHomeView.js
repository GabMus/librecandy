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
            <div className='CandyHomeView'>
                <div>
                    <CandyHorizontalCardview
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
                    ></CandyHorizontalCardview>
                </div>
            </div>
        );
    }
}

export default CandyHomeView;
