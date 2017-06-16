import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

const base64 = require('base-64');

class Candy404 extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;

        return (
            <div className='Candy404' style={{textAlign: 'center'}}>
                <h1>404</h1>
                <h2>You have reached a dead end</h2>
                <RaisedButton secondary={true} label='Go back home' containerElement={<Link to="/" />}/>
            </div>
        );
    }
}

export default muiThemeable() (Candy404);
