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
            user: props.user || {
                username: 'gabmus',
                email: 'emaildigabry@gmail.com',
                realname: 'Gabriele Musco',
                avatar: 'http://etikhacker.org/images/site/etikhacker.png',
                bio: 'Evil linux enthusiast. Extreme gamer. Food expert. Avid travel aficionado. Troublemaker.',
                signup_datetime: 'May 25th, 2017'
            },
            treats: this.props.treats || [
                {
                    name: 'Wall',
                    total_rating: 6,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Wallpapers'
                },
                {
                    name: 'Theme',
                    total_rating: 8,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'GTK'
                },
                {
                    name: 'Iconium',
                    total_rating: 9,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Icons'
                },
                {
                    name: 'Wall',
                    total_rating: 6,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Wallpapers'
                },
                {
                    name: 'Theme',
                    total_rating: 8,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'GTK'
                },
                {
                    name: 'Iconium',
                    total_rating: 9,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Icons'
                },
                {
                    name: 'Wall',
                    total_rating: 6,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Wallpapers'
                },
                {
                    name: 'Theme',
                    total_rating: 8,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'GTK'
                },
                {
                    name: 'Iconium',
                    total_rating: 9,
                    screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                    author: 'gabmus',
                    category: 'Icons'
                },
            ]
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandyUserView' style={{ margin: '12px 12px 12px 12px' }}>
                <Grid>
                    <Row>
                        <Col xs={12} md={4} lg={4}>
                            <CandyUserCard
                                username={this.state.user.username}
                                email={this.state.user.email}
                                realname={this.state.user.realname}
                                avatar={this.state.user.avatar}
                                bio={this.state.user.bio}
                                signup_datetime={this.state.user.signup_datetime}
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
