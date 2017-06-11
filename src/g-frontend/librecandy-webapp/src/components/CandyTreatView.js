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

class CandyTreatView extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            treat: null,
            author: null,
            userToken: this.props.userToken,
            userRating: null,
            treatname: props.treatname || 'TREAT_NAME',
            treatdescription: props.treatdescription || 'TREAT_DESC',
            treatrating: props.treatrating || 0,
            treatuserrating: props.treatuserrating || 0,
            treatscreenshots: props.treatscreenshots || [],
            treatauthor: props.treatauthor || 'TREAT_AUTHOR',
            treatcategory: props.treatcategory || 'GTK',
            treatcomments: props.treatcomments || [],
        };

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
        fetch(`${this.props.apiServer}/treats/${this.props.match.params.pkgname}`, request)
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
                    this.setState({treat: data.treat, author: data.author});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
    }

    updateUserRating = () => {
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
        fetch(`${this.props.apiServer}/treats/${this.props.match.params.pkgname}/ratings/fromuser`, request)
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
                    this.setState({userRating: data.rating});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
    }

    submitRating = (newRating) => {
        newRating = newRating*2;
        let headers = {
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        if (this.state.userToken) {
            headers['Authorization'] = `JWT ${this.state.userToken}`;
        }
        else {
            console.log('User not logged');
            return;
        }
        let body = `rating=${newRating}`;
        console.log(body);
        let request = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: body
        };
        // TODO fix rating update for userRating
        fetch(`${this.props.apiServer}/treats/${this.state.treat.package_name}/ratings`, request)
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
                    console.log(data);
                }
                else {
                    this.setState({treat: data.treat});
                    this.updateUserRating();
                    //this.setState({comments: data.treat.comments});
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
    }

    render() {
        if (!this.state.userRating) {
            this.updateUserRating();
        }
        let palette = this.props.muiTheme.palette;
        let categoryBlock = null;
        let categoryIconStyle = {
            width: '24px',
            float: 'left'
        }
        if (!this.state.treat) {
            return (
                <h2>Nothing here!</h2>
            )
        }
        switch (this.state.treat.category) {
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
            <div className='CandyTreatView' style={{ margin: '12px 12px 12px 12px' }}>
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
                                    title={this.state.author.realname || this.state.author.username}
                                    subtitle={this.state.author.realname && this.state.author.username}
                                    avatar={this.state.author.avatar || ''}
                                />

                                <CardTitle
                                    title={this.state.treat.name}
                                    subtitle={categoryBlock}
                                />
                                <CardText>
                                    <div style={{lineHeight: '16px', paddingBottom: '7px'}}>
                                        <span style={{float: 'left', paddingRight: '7px'}}>Rate</span>
                                        <ReactStars
                                            count={5}
                                            style={{display: 'block', float: 'left'}}
                                            edit={!!this.state.userToken}
                                            onChange={this.submitRating}
                                            size={24}
                                            color2={palette.accent1Color}
                                            value={this.state.userRating/2}
                                        />
                                    </div>
                                    <div style={{lineHeight: '14px', display: 'block', paddingBottom: '24px'}}>
                                        <ToggleStarIcon color={palette.iconGrey} style={{width: '14px', height: '14px', float: 'left'}} />
                                        <span style={{float: 'left', paddingLeft: '7px'}}>{this.state.treat.total_rating/2}</span>
                                    </div>
                                    <div style={{marginTop: '24px'}}>
                                        <ReactMarkdown
                                            source={this.state.treat.description}
                                            className='treatdescription'
                                        />
                                    </div>
                                </CardText>
                            </Card>
                        </Col>
                        <Col xs={12} md={4} lg={4}>
                            <CandyTreatDownloadBox
                                versions={this.state.treat.details}
                            />
                        </Col>
                        <Col xs={12}>
                            <CandyTreatCommentsBox
                                userToken={this.state.userToken}
                                comments={this.state.treat.comments}
                                apiServer={this.props.apiServer}
                                pkgname={this.state.treat.package_name}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatView);
