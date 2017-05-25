import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {GtkIcon, QtIcon} from './CandyMatIcons';
import MapsLayers from 'material-ui/svg-icons/maps/layers';
import ImageCollectionsIcon from 'material-ui/svg-icons/image/collections';

import ReactStars from 'react-stars'; // doc: https://github.com/n49/react-stars
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star'

import CandyScreenshotGallery from './CandyScreenshotGallery';
import CandyTreatDownloadBox from './CandyTreatDownloadBox';
import CandyTreatCommentsBox from './CandyTreatCommentsBox';
import ReactMarkdown from 'react-markdown';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';

class CandyUserView extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            treatname: props.treatname || 'TREAT_NAME',
            treatdescription: props.treatdescription || 'TREAT_DESC',
            treatrating: props.treatrating || 0,
            treatuserrating: props.treatuserrating || 0,
            treatscreenshots: props.treatscreenshots || ['https://www.w3schools.com/w3images/fjords.jpg'],
            treatauthor: props.treatauthor || 'TREAT_AUTHOR',
            treatcategory: props.treatcategory || 'GTK',
            treatcomments: props.treatcomments || [],
        };
    }

    submitRating = (newRating) => {
        newRating = newRating*2;
        console.log(newRating);
        //TODO: send rating and reload(?) page
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let categoryBlock = null;
        let categoryIconStyle = {
            width: '24px',
            float: 'left'
        }
        switch (this.state.treatcategory) {
            case 'GTK':
                categoryBlock = (
                    <div style={{lineHeight: '24px'}}>
                        <GtkIcon color={palette.iconGrey} style={categoryIconStyle} />
                        <span style={{float: 'left'}}>Gtk theme</span>
                    </div>
                );
                break;
            case 'Qt':
                categoryBlock = (
                    <div style={{lineHeight: '24px'}}>
                        <QtIcon color={palette.iconGrey} style={categoryIconStyle} />
                        <span style={{float: 'left'}}>Qt theme</span>
                    </div>
                );
                break;
            case 'Icons':
                categoryBlock = (
                    <div style={{lineHeight: '24px'}}>
                        <MapsLayers color={palette.iconGrey} style={categoryIconStyle} />
                        <span style={{float: 'left'}}>Icon pack</span>
                    </div>
                );
                break;
            case 'Wallpapers':
                categoryBlock = (
                    <div style={{lineHeight: '24px'}}>
                        <ImageCollectionsIcon color={palette.iconGrey} style={categoryIconStyle} />
                        <span style={{float: 'left'}}>Wallpaper</span>
                    </div>
                );
                break;
            default:
                categoryBlock = (
                    <div style={{lineHeight: '24px'}}>
                        <GtkIcon color={palette.iconGrey} style={categoryIconStyle} />
                        <span style={{float: 'left'}}>Gtk theme</span>
                    </div>
                );
        }

        let formattedScreenshots = [];
        for (let i in this.state.treatscreenshots) {
            formattedScreenshots.push({
                original: this.state.treatscreenshots[i],
                originalClass: 'screenshot'
            });
        }

        return (
            <div className='CandyUserView' style={{ margin: '12px 12px 12px 12px' }}>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <CandyScreenshotGallery screenshots={formattedScreenshots}></CandyScreenshotGallery>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={8} lg={8}>
                            <Card className='fullbleedcard'>
                                <CardHeader
                                    title={this.state.treatauthor}
                                    subtitle='Subtitle'
                                    avatar=''
                                />

                                <CardTitle
                                    title={this.state.treatname}
                                    subtitle={categoryBlock}
                                />
                                <CardText>
                                    <div style={{display: 'block', lineHeight: '16px', paddingBottom: '7px'}}>
                                        <span style={{float: 'left', paddingRight: '7px'}}>Rate</span>
                                        <ReactStars
                                            count={5}
                                            style={{display: 'block', float: 'left'}}
                                            onChange={this.submitRating}
                                            size={24}
                                            color2={palette.accent1Color}
                                            value={this.state.treatuserrating}
                                        />
                                    </div>
                                    <div style={{lineHeight: '14px', display: 'block', paddingBottom: '24px'}}>
                                        <ToggleStarIcon color={palette.iconGrey} style={{width: '14px', height: '14px', float: 'left'}} />
                                        <span style={{float: 'left', paddingLeft: '7px'}}>{this.state.treatrating/2}</span>
                                    </div>
                                    <div style={{marginTop: '24px'}}>
                                        <ReactMarkdown
                                            source={this.state.treatdescription}
                                            className='treatdescription'
                                        />
                                    </div>
                                </CardText>
                            </Card>
                        </Col>
                        <Col xs={12} md={4} lg={4}>
                            <CandyTreatDownloadBox />
                        </Col>
                        <Col xs={12}>
                            <CandyTreatCommentsBox />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default muiThemeable() (CandyUserView);
