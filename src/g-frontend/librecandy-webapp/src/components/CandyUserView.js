import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';

import CandyUserCard from './CandyUserCard';
import CandyHorizontalCardview from './CandyHorizontalCardview';

class CandyUserView extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            userToken: props.userToken,
            username: props.username,
            user: {
                username: '',
                email: '',
                realname: '',
                avatar: '',
                bio: '',
                signup_datetime: ''
            },
            treats: [],
        };
    }

    componentDidMount() {
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
        fetch(`${this.props.apiServer}/users/${this.props.match.params.username}`, request)
            .then(response => {
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
                    this.setState({user: data});
                    fetch(`${this.props.apiServer}/users/${this.props.match.params.username}/treats?limit=999`, request)
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
                                this.setState({treats: data.treats});

                            }
                        }
                    );
                }
            }
        );
    }

    render() {
        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandyUserView' style={{ margin: '12px 12px 12px 12px' }}>
                <Grid>
                    <Row>
                        <Col xs={12} md={4} lg={4}>
                            <CandyUserCard
                                user={this.state.user}
                                userToken={this.props.userToken}
                                apiServer={this.props.apiServer}
                            />
                        </Col>
                        <Col xs={12} md={8} lg={8}>
                            <span style={{textAlign: 'center', display: 'block', width: '100%'}} className='sectionHeader'>{this.state.user.username+'\'s treats'}</span>
                            <CandyHorizontalCardview
                                treats={this.state.treats}
                                seemore={false}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default muiThemeable() (CandyUserView);
