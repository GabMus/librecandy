import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

class CandyRegisterOrLogin extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            loginopen: true,
            registeropen: false,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let loginRegisterListItemStyle = {
            paddingTop: '0px',
            paddingTop: '0px',
        };
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
                                            />
                                        }
                                    />
                                </div>)
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
                                            />
                                        }
                                    />
                                </div>),
                            ]}
                        />
                    </List>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyRegisterOrLogin);
