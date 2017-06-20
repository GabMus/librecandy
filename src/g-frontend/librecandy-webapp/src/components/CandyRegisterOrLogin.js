import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CandyFetch from './../extjs/CandyFetch';

const base64 = require('base-64');

class CandyRegisterOrLogin extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            loginopen: true,
            registeropen: false,
            loginUsername: '',
            loginPassword: '',

            loginError: '',

            registerUsername: '',
            registerRealname: '',
            registerEmail: '',
            registerPassword: '',
            registerPasswordVerification: '',
            registerBio: '',
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let loginRegisterListItemStyle = {
            paddingTop: '0px',
            paddingTop: '0px',
        };

        let loginErrorDisplay = null;
        if (this.state.loginError) {
            loginErrorDisplay = (
                <div style={{padding: '6px auto 6px auto', backgroundColor: 'rgba(255,0,0,.1)', color: 'red', textAlign: 'center'}}>
                    <h2>{this.state.loginError}</h2>
                </div>
            );
        }

        let doLogin = () => {
            if (!this.state.loginUsername) return;
            if (!this.state.loginPassword) return;
            // NOTE: didn't use CandyFetch because it's a different kind of request
            let request = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${this.state.loginUsername}:${this.state.loginPassword}`),
                    'Access-Control-Allow-Origin':'*'
                }
            };
            fetch(`${this.props.apiServer}/authenticate`, request)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        return response;
                    }
                })
                .then(data => {
                    if (data.status && data.status == 401) {
                        this.setState({loginError: 'Username or password invalid'});
                    }
                    else {
                        document.cookie=`JWT_AUTH=${data.token}`;
                        this.props.onLogin();
                    }
                }
            );
        }

        let doRegister = () => {
            if (!this.state.registerUsername) return;
            if (!this.state.registerEmail) return;
            if (!this.state.registerPassword) return;
            if (this.state.registerPassword != this.state.registerPasswordVerification) {
                return;
            }
            CandyFetch.postIt(
                `${this.props.apiServer}/users`,
                null,
                {
                    username: this.state.registerUsername,
                    email: this.state.registerEmail,
                    password: this.state.registerPassword,
                    realname: this.state.registerRealname,
                    bio: this.state.registerBio
                },
                (data) => {
                    console.log('User created');
                    console.log(data);
                }
            );
        }

        return (
            <div className='CandyRegisterOrLogin'>
                <Card className='loginregistercard'>
                    <div id='loginForm' style={{
                        display: this.state.loginopen ? 'block' : 'none',
                    }}>
                        <CardTitle title='Login' />

                        <CardText>
                            {loginErrorDisplay}
                            <TextField
                                floatingLabelText='Username'
                                fullWidth={true}
                                onChange={(event, newValue) => {
                                    this.setState({
                                        loginUsername : newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='Password'
                                fullWidth={true}
                                type='password'
                                onChange={(event, newValue) => {
                                    this.setState({
                                        loginPassword : newValue
                                    });
                                }}
                            />
                        </CardText>
                        <CardActions style={{
                            marginLeft: 'auto',
                            display: 'table'
                        }}>
                        <FlatButton
                            style={{marginLeft: 'auto'}}
                            label='Register'
                            primary={true}
                            onTouchTap={() => {
                                this.setState({
                                    registeropen: true,
                                    loginopen: false
                                });
                            }}
                        />
                        <RaisedButton
                            style={{marginLeft: 'auto'}}
                            label='Login'
                            primary={true}
                            onTouchTap={() => {doLogin()}}
                        />
                    </CardActions>
                    </div>

                    {/* XXXXXXXXXXXXXXXXXXXXXXXXXXX */}

                    <div id='registrationForm' style={{
                        display: this.state.registeropen ? 'block' : 'none',
                    }}>
                        <CardTitle title='Register' />
                        <CardText>
                            <TextField
                                floatingLabelText='Username'
                                fullWidth={true}
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerUsername: newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='Real name'
                                fullWidth={true}
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerRealname: newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='E-Mail'
                                fullWidth={true}
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerEmail: newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='Password'
                                fullWidth={true}
                                type='password'
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerPassword: newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='Re-type password'
                                fullWidth={true}
                                type='password'
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerPasswordVerification: newValue
                                    });
                                }}
                            />
                            <TextField
                                floatingLabelText='Bio'
                                multiLine={true}
                                fullWidth={true}
                                onChange={(event, newValue) => {
                                    this.setState({
                                        registerBio: newValue
                                    });
                                }}
                            />
                        </CardText>
                        <CardActions style={{
                            marginLeft: 'auto',
                            display: 'table'
                        }}>
                        <FlatButton
                            style={{marginLeft: 'auto'}}
                            label='Login'
                            primary={true}
                            onTouchTap={() => {
                                this.setState({
                                    registeropen: false,
                                    loginopen: true
                                });
                            }}
                        />
                        <RaisedButton
                            style={{
                                marginLeft: 'auto',
                            }}
                            label='Register'
                            primary={true}
                            onTouchTap={() => {doRegister()}}
                        />
                    </CardActions>
                    </div>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyRegisterOrLogin);
