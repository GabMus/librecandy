import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';
import CandyTreatCard from './CandyTreatCard';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton'

class CandyHorizontalCardview extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            leftIcon: this.props.leftIcon,
            label: this.props.label,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let deprecatedItems = [];
        return (
            <div className='CandyHorizontalCardview'>

                <div className='sectionHeaderContainer'>
                    {this.state.leftIcon}
                    <h2 className='sectionHeader'>
                        {this.state.label}
                    </h2>
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItem: 'center',
                    justifyContent: 'center',
                }}>
                    <CandyTreatCard></CandyTreatCard>
                    <CandyTreatCard></CandyTreatCard>
                    <CandyTreatCard></CandyTreatCard>
                    <CandyTreatCard></CandyTreatCard>
                    <RaisedButton
                        label="See more"
                        style={{
                            margin: 'auto 15px auto 15px',
                            width: '150px',
                            height: '70px',
                            display: 'inline-block',
                        }}
                        secondary={true}
                        labelStyle={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            lineHeight: '70px',
                            fontSize: '16pt'
                        }}
                    />

                </div>
            </div>
        );
    }
}

export default muiThemeable() (CandyHorizontalCardview);
