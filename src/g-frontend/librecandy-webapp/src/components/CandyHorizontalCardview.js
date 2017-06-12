import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';
import CandyTreatCard from './CandyTreatCard';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton'
import { Link } from 'react-router-dom';

class CandyHorizontalCardview extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            leftIcon: this.props.leftIcon || (<div />),
            label: this.props.label || null,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let seemoreOrNothing = null;
        if (this.props.seemore !== false && this.props.treats) {
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
                containerElement={<Link to={this.props.seemorelink} className='link' />}
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
            <div className='CandyHorizontalCardview' style={{margin: 'auto', display: 'block'}}>

                {sectionLabelHeader}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'left',
                    alignContent: 'left',
                    justifyContent: 'space-around'
                }}>
                    {(this.props.treats && this.props.treats.map((treat, iter) => {
                        let pic=null;
                        if (treat.screenshots) {
                            pic=treat.screenshots[0];
                        }
                        return (<CandyTreatCard
                            treat={treat}
                            treatname={treat.name}
                            treatrating={treat.total_rating}
                            treatpic={pic}
                            treatauthor={treat.author}
                            treatcategory={treat.category}
                            key={iter}
                        />);
                    })) || <h2>Nothing here!</h2>}
                    {seemoreOrNothing}

                </div>
            </div>
        );
    }
}

export default muiThemeable() (CandyHorizontalCardview);
