import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

class CandySeeMoreButton extends Component {
    constructor(props) {
        super(props);
        this.props=props;
    }

    render() {
        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandySeeMoreButton'>
                <RaisedButton
                    label="See more"
                    background-color={palette.accent3Color}
                    rippleColor={palette.accent2Color}
                    hoverColor={palette.accent1Color}>
                </RaisedButton>
            </div>
        );
    }
}

export default muiThemeable() (CandySeeMoreButton);
