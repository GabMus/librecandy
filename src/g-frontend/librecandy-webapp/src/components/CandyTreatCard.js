import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {GtkIcon, QtIcon} from './CandyMatIcons';
import MapsLayers from 'material-ui/svg-icons/maps/layers';
import ImageCollectionsIcon from 'material-ui/svg-icons/image/collections';

import ReactStars from 'react-stars'; // doc: https://github.com/n49/react-stars

class CandyTreatCard extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            treatname: props.treatname || 'TREAT_NAME',
            treatrating: props.treatrating || 0,
            treatpic: props.treatpic || 'https://www.w3schools.com/w3images/fjords.jpg',
            treatauthor: props.treatauthor || 'TREAT_AUTHOR',
            treatcategory: props.treatcategory || 'GTK'
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let categoryIcon = null;
        switch (this.state.treatcategory) {
            case 'GTK':
                categoryIcon = (<GtkIcon color={palette.iconGrey} style={{float: 'right', width: '24px'}} />);
                break;
            case 'Qt':
                categoryIcon = (<QtIcon color={palette.iconGrey} style={{float: 'right', width: '24px'}} />);
                break;
            case 'Icons':
                categoryIcon = (<MapsLayers color={palette.iconGrey} style={{float: 'right', width: '24px'}} />);
                break;
            case 'Wallpapers':
                categoryIcon = (<ImageCollectionsIcon color={palette.iconGrey} style={{float: 'right', width: '24px'}} />);
                break;
            default:
                categoryIcon = (<GtkIcon color={palette.iconGrey} style={{float: 'right', width: '24px'}} />);
        }
        return (
            <div className='CandyTreatCard' style={{margin: '12px 12px 12px 12px'}}>
                <Card style={{
                    margin: 'auto',
                    width: '250px',
                    maxWidth: '250px',
                    minHeight: '250px',
                    maxHeight: '290px'
                }}>
                    <CardMedia>
                        <img
                            style={{
                                objectFit: 'cover',
                                width: '250px',
                                height: '140px'
                            }}
                            src={this.state.treatpic}
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
                            title={this.state.treatname}
                            subtitle={
                                <span>
                                    By {this.state.treatauthor}
                                    {//<Link to={this.state.treatauthor}>this.state.treatauthor</Link>
                                    }
                                </span>
                            }
                        />
                        <div style={{
                            padding: '0 12px 0 12px',
                            lineHeight: '24px'
                        }}>
                        {categoryIcon}
                            <ReactStars
                                style={{float: 'left'}}
                                count={5}
                                onChange={(newRating) => {console.log(newRating*2)}}
                                size={24}
                                color2={palette.accent1Color}
                                value={this.state.treatrating/2}
                                edit={false} />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatCard);
