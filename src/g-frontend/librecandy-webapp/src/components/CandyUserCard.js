import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';

class CandyUserCard extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            user: props.user || {
                username: 'gabmus',
                email: 'emaildigabry@gmail.com',
                realname: 'Gabriele Musco',
                avatar: 'http://i923.photobucket.com/albums/ad73/josu22/Avatarhacker.jpg',
                bio: 'Evil linux enthusiast. Extreme gamer. Food expert. Avid travel aficionado. Troublemaker.',
                signup_datetime: 'May 25th, 2017'
            }
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandyUserCard' style={{margin: '12px 12px 12px 12px'}}>
                <Card className='fullbleedcard'>
                    <CardText style={{textAlign: 'center'}}>
                        <img src={this.state.user.avatar} style={{
                            borderRadius: '100%',
                            objectFit: 'cover',
                            width: '170px',
                            height: '170px',
                            margin: 'auto',
                            display: 'block'
                        }} />
                        <div style={{
                            marginTop: '25px'
                        }}>
                            <h1 style={{
                                fontSize: '18pt',
                                fontWeight: 'thin',
                                color: palette.textColor,
                                margin: '0 0 0 0',
                                padding: '0 0 0 0',
                            }}>{this.state.user.realname}</h1>
                            <h2 style={{
                                fontSize: '12pt',
                                fontWeight: 'thin',
                                color: palette.iconGrey,
                                margin: '0 0 0 0',
                                padding: '0 0 0 0',
                            }}>{this.state.user.username}</h2>
                            <p style={{
                                fontSize: '10pt',
                                fontWeight: 'thin',
                                color: palette.iconGrey,
                                margin: '0 0 0 0',
                                padding: '20px 0 0 0',
                            }}>Member of Librecandy since {this.state.user.signup_datetime}</p>
                        </div>
                        <div style={{marginTop: '24px'}}>
                            <ReactMarkdown
                                source={this.state.user.bio}
                                className='treatdescription'
                            />
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyUserCard);
