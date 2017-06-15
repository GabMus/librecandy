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
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'; 'material-ui/svg-icons/editor/mode-edit';

class CandyTreatView extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            edit: false,
            treat: null,
            author: null,
            userToken: props.userToken,
            userRating: null,
            newDescription: null,
            treatname: props.treatname || 'TREAT_NAME',
            treatdescription: props.treatdescription || 'TREAT_DESC',
            treatrating: props.treatrating || 0,
            treatuserrating: props.treatuserrating || 0,
            treatscreenshots: props.treatscreenshots || [],
            treatauthor: props.treatauthor || 'TREAT_AUTHOR',
            treatcategory: props.treatcategory || 'GTK',
            treatcomments: props.treatcomments || [],
        };
    }

    componentDidMount() {

        if (!this.state.userRating) {
            this.updateUserRating();
        }

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
                    this.setState({treat: data.treat, author: data.author, newDescription: data.treat.description});
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

    getUserAvatar(username) {
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
        fetch(`${this.props.apiServer}/users/${this.state.treat.author}`, request)
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
                    return data.avatar
                }
            }
        );
    }

    render() {
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

        let description = (
            <div style={{marginTop: '24px'}}>
                <ReactMarkdown
                    source={this.state.treat.description}
                    className='treatdescription'
                />
            </div>
        );
        if (this.state.edit) {
            description = (
                <div style={{marginTop: '24px'}}>
                    <TextField
                        floatingLabelText='Description'
                        fullWidth={true}
                        onChange={(event, newValue) => {
                            this.setState({newDescription: event.target.value});
                        }}
                        multiLine={true}
                        value={this.state.newDescription}
                    />
                    <RaisedButton
                        label='Save'
                        secondary={true}
                        onTouchTap={() => {
                            let headers = {
                                'Access-Control-Allow-Origin':'*',
                                'Content-Type': 'application/x-www-form-urlencoded'
                            };
                            if (this.props.userToken) {
                                headers['Authorization'] = `JWT ${this.props.userToken}`;
                            }
                            else {
                                console.log('User not logged');
                                return;
                            }
                            let body = `description=${this.state.newDescription}`;
                            let request = {
                                method: 'PUT',
                                mode: 'cors',
                                headers: headers,
                                body: body
                            };
                            fetch(`${this.props.apiServer}/treats/${this.state.treat.package_name}`, request)
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
                                        console.log('treat modified');
                                        let newtreat=this.state.treat;
                                        newtreat.description=this.state.newDescription;
                                        this.setState({edit: false, treat: newtreat});
                                        //console.log(this.state.latestTreats.treats[0]);
                                    }
                                    //this.setState({commentPostLock: true});
                                }
                            );
                        }}
                    />
                </div>
            )
        }

        let editBtn=null;
        if (this.state.treat && this.props.userToken && this.state.treat.author == JSON.parse(atob(this.props.userToken.split('.')[1])).username && !this.state.edit) {
            editBtn=(
                <FlatButton touch={true}
                    onTouchTap={() => {this.setState({edit: 'true'})}}
                    secondary={true}
                    label='Edit'
                />
            );
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
                                    avatar={this.getUserAvatar(this.state.author.username) || ''}
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
                                            onChange={this.submitRating}
                                            color2={palette.accent1Color}
                                            size={24}
                                            value={this.state.userRating/2}
                                            edit={!!this.state.userToken ? undefined : false}
                                        />
                                    </div>
                                    <div style={{lineHeight: '14px', display: 'block', paddingBottom: '24px'}}>
                                        <ToggleStarIcon color={palette.iconGrey} style={{width: '14px', height: '14px', float: 'left'}} />
                                        <span style={{float: 'left', paddingLeft: '7px'}}>{this.state.treat.total_rating/2}</span>
                                    </div>
                                    <div style={{position: 'relative'}}>
                                        {editBtn}
                                        {description}
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
