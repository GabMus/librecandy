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
            leftIcon: this.props.leftIcon || (<div />),
            label: this.props.label || null,
            treats: this.props.treats || [],
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let seemoreOrNothing = null;
        if (this.props.seemore !== false) {
            seemoreOrNothing = (<RaisedButton
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
            />);
        }
        let sectionLabelHeader = null;
        if (this.state.label) {
            sectionLabelHeader = (
                <div className='sectionHeaderContainer'>
                    {this.state.leftIcon}
                    <h2 className='sectionHeader'>
                        {this.state.label}
                    </h2>
                </div>
            )
        }
        return (
            <div className='CandyHorizontalCardview'>

                {sectionLabelHeader}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItem: 'center',
                    justifyContent: 'center',
                }}>
                    {this.state.treats.map((treat, iter) => {
                        return (<CandyTreatCard
                            treatname={treat.name}
                            treatrating={treat.total_rating}
                            treatpic={treat.screenshots[0].file}
                            treatauthor={treat.author}
                            treatcategory={treat.category}
                        />);
                    })}
                    {seemoreOrNothing}

                </div>
            </div>
        );
    }
}

export default muiThemeable() (CandyHorizontalCardview);
