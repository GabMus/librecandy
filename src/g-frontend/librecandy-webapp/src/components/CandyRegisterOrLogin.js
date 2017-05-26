import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class CandyRegisterOrLogin extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            loginopen: true,
            registeropen: false,
            loginUsername: '',
            loginPassword: '',

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

        let doLogin = () => {
            console.log(this.state.loginUsername);
            console.log(this.state.loginPassword);
        }

        let doRegister = () => {
            if (!this.state.registerUsername) return;
            if (!this.state.registerEmail) return;
            if (!this.state.registerPassword) return;
            if (this.state.registerPassword != this.state.registerPasswordVerification) {
                return;
            }
            let request = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin':'*'
                },
                body: `username=${this.state.registerUsername}&email=${this.state.registerEmail}&password=${this.state.registerPassword}&realname=${this.state.registerRealname}&bio=${this.state.registerBio}`
            }
            fetch(`${this.props.apiServer}/users`, request)
                .then(response => {
                    console.log(response);
                }
            );
        }

        return (
            <div className='CandyRegisterOrLogin'>
                <Card className='loginregistercard'>
                    <List style={{paddingBottom: '0px', paddingTop: '0px'}}>
                        <ListItem
                            primaryText={<span style={{fontSize: '18pt'}}>Login</span>}
                            open={this.state.loginopen}
                            onTouchTap={() => {this.setState({loginopen: !this.state.loginopen, registeropen: !this.state.registeropen}); console.log('test');}}
                            nestedItems={[
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
                                            <TextField
                                                floatingLabelText='Username'
                                                fullWidth={true}
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        loginUsername : newValue
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
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
                                        }
                                    />
                                </div>),
                                (
                                    <FlatButton
                                        style={{marginLeft: '12px'}}
                                        label='Login'
                                        primary={true}
                                        onTouchTap={() => {doLogin()}}
                                    />
                                )
                            ]}
                        />
                        <ListItem
                            primaryText={<span style={{fontSize: '18pt'}}>Register</span>}
                            open={this.state.registeropen}
                            onTouchTap={() => {this.setState({loginopen: !this.state.loginopen, registeropen: !this.state.registeropen})}}
                            nestedItems={[
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
                                            <TextField
                                                floatingLabelText='Username'
                                                fullWidth={true}
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        registerUsername: newValue
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
                                            <TextField
                                                floatingLabelText='Real name'
                                                fullWidth={true}
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        registerRealname: newValue
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
                                            <TextField
                                                floatingLabelText='E-Mail'
                                                fullWidth={true}
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        registerEmail: newValue
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
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
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
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
                                        }
                                    />
                                </div>),
                                (<div>
                                    <ListItem style={loginRegisterListItemStyle}
                                        disabled={true}
                                        primaryText={
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
                                        }
                                    />
                                </div>),
                                <FlatButton
                                    style={{marginLeft: '12px'}}
                                    label='Register'
                                    primary={true}
                                    onTouchTap={() => {doRegister()}}
                                />
                            ]}
                        />
                    </List>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyRegisterOrLogin);
