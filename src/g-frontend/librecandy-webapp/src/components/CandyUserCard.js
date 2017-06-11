import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';

class CandyUserCard extends Component {
    constructor(props) {
        super(props);
        this.props=props;
    }

    render() {
        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandyUserCard' style={{margin: '12px 12px 12px 12px'}}>
                <Card className='fullbleedcard'>
                    <CardText style={{textAlign: 'center'}}>
                        <img src={this.props.user.avatar || 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'} style={{
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
                            }}>{this.props.user.realname}</h1>
                            <h2 style={{
                                fontSize: '12pt',
                                fontWeight: 'thin',
                                color: palette.iconGrey,
                                margin: '0 0 0 0',
                                padding: '0 0 0 0',
                            }}>{this.props.user.username}</h2>
                            <p style={{
                                fontSize: '10pt',
                                fontWeight: 'thin',
                                color: palette.iconGrey,
                                margin: '0 0 0 0',
                                padding: '20px 0 0 0',
                            }}>Member of Librecandy since {new Date(this.props.user.signup_datetime).toDateString()}</p>
                        </div>
                        <div style={{marginTop: '24px'}}>
                            <ReactMarkdown
                                source={this.props.user.bio}
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
