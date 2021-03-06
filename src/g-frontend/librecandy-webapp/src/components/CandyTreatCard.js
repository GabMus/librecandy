import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import CandyCategoryIcon from './CandyCategoryIcon';

import ReactStars from 'react-stars'; // doc: https://github.com/n49/react-stars
import { Link } from 'react-router-dom';

class CandyTreatCard extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            treat: props.treat,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let pic=`${process.env.PUBLIC_URL}/img/header_bw.png`;
        if (this.state.treat && this.state.treat.screenshots[0]) {
            pic=this.state.treat.screenshots[0];
        }
        return (
            <div className='CandyTreatCard' style={{margin: '12px 12px 12px 12px'}}>
                <Link to={`/treat/${this.state.treat.package_name}`} className='link'>
                    <div className='treatCardOverlay' />
                </Link>
                <Card style={{
                    margin: 'auto',
                    width: '250px',
                    maxWidth: '250px',
                    minHeight: '250px',
                    maxHeight: '250px',
                }}>
                    <CardMedia>
                        <img
                            style={{
                                objectFit: 'cover',
                                width: '250px',
                                height: '140px',
                                borderRadius: '2px'
                            }}
                            src={pic}
                        />
                    </CardMedia>
                    <div>
                        <CardTitle
                            titleStyle={{
                                fontSize: 18,
                            }}
                            subtitleStyle={{
                                fontSize: 10,
                            }}
                            title={this.state.treat.name}
                            subtitle={
                                <span>
                                    By {this.state.treat.author}
                                    {//<Link to={this.state.treatauthor}>this.state.treatauthor</Link>
                                }
                            </span>
                        }
                        />
                        <div style={{
                            padding: '0 12px 0 12px',
                            lineHeight: '24px'
                        }}>
                            <CandyCategoryIcon
                                category={this.state.treat.category}
                                style={{
                                    float: 'right'
                                }}
                            />
                            <ReactStars
                                style={{float: 'left'}}
                                count={5}
                                size={24}
                                color2={palette.accent1Color}
                                value={this.state.treat.total_rating/2}
                                edit={false} />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatCard);
