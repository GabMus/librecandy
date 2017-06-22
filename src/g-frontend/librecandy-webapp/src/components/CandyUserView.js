import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';

import CandyUserCard from './CandyUserCard';
import CandyHorizontalCardview from './CandyHorizontalCardview';
import CandyFetch from '../extjs/CandyFetch';


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
        CandyFetch.getIt(
            `${this.props.apiServer}/users/${this.props.match.params.username}`,
            this.props.userToken,
            (data) => {
                this.setState({user: data});
                CandyFetch.getIt(
                    `${this.props.apiServer}/users/${this.props.match.params.username}/treats?limit=999`,
                    this.props.userToken,
                    (data) => {
                        this.setState({treats: data.treats});
                    }
                );
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
                                twoCols={true}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default muiThemeable() (CandyUserView);
