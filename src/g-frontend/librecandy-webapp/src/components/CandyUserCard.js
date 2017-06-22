import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import ReactMarkdown from 'react-markdown';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';

import CandyFetch from './../extjs/CandyFetch';

import Dropzone from 'react-dropzone';

class CandyUserCard extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            edit: this.props.edit ? true : false,
            currentRealname: this.props.user.realname,
            currentBio: this.props.user.bio,
            newRealname: this.props.user.realname,
            newBio: this.props.user.bio,
            newPassword: null,
        }
    }

    componentWillReceiveProps() {
        this.setState({
            newRealname: this.props.user.realname,
            newBio: this.props.user.bio,
            currentRealname: this.props.user.realname,
            currentBio: this.props.user.bio,
        });
    }

    uploadUserAvatar = (file) => {
      let formData = new FormData();
      console.log(file)
      formData.append('avatar',file[0])
      let headers = {};
      if (this.props.userToken)
          headers['Authorization'] = `JWT ${this.props.userToken}`;
      else {
          console.log('User not logged');
          return;
      }
      let request = {
          method: 'POST',
          mode: 'cors',
          headers: headers,
          body: formData
      };
      console.log(`${this.props.apiServer}/users/${this.props.user.username}/avatar`)
      fetch(`${this.props.apiServer}/users/${this.props.user.username}/avatar`, request)
      .then(response => {return response.json()})
      .then(data => console.log(data))
      .catch(error => console.error(error))
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let realname=(
            <h1 style={{
                fontSize: '18pt',
                fontWeight: 'thin',
                color: palette.textColor,
                margin: '0 0 0 0',
                padding: '0 0 0 0',
            }}>{this.state.currentRealname}</h1>
        );

        let username=(<h2 style={{
            fontSize: '12pt',
            fontWeight: 'thin',
            color: palette.iconGrey,
            margin: '0 0 0 0',
            padding: '0 0 0 0',
        }}>{this.props.user.username}</h2>);

        let joindate=(<p style={{
            fontSize: '10pt',
            fontWeight: 'thin',
            color: palette.iconGrey,
            margin: '0 0 0 0',
            padding: '20px 0 0 0',
        }}>Member of Librecandy since {new Date(this.props.user.signup_datetime).toDateString()}</p>);

        let userbio=(
            <div style={{marginTop: '24px'}}>
                <ReactMarkdown
                    source={this.state.currentBio}
                    className='treatdescription'
                />
            </div>
        );

        let password=null;

        let saveBtn=null;


        if (this.state.edit) {
            realname = (
                <TextField
                    floatingLabelText='Real name'
                    fullWidth={true}
                    onChange={(event, newValue) => {
                        this.setState({
                            newRealname: event.target.value
                        });
                    }}
                    value={this.state.newRealname}
                />
            );
            userbio = (
                <TextField style={{textAlign: 'left'}}
                    floatingLabelText='Bio'
                    fullWidth={true}
                    onChange={(event, newValue) => {
                        this.setState({
                            newBio: event.target.value
                        });
                    }}
                    multiLine={true}
                    value={this.state.newBio}
                />
            );
            saveBtn=(
                <CardActions style={{
                    marginLeft: 'auto',
                    display: 'table'
                }}>
                    <FlatButton
                        label='Cancel'
                        primary={true}
                        onTouchTap={() => {
                            this.setState({
                                edit: false,
                                newBio: this.state.currentBio,
                                newRealname: this.state.currentRealname,
                                newPassword: null
                            });
                        }}
                    />
                    <RaisedButton
                        label='Save'
                        primary={true}
                        onTouchTap={() => {
                            let reqbody={
                                realname: this.state.newRealname || '',
                                bio: this.state.newBio || '',
                            };
                            if (this.state.newPassword && this.state.newPassword.trim()!='') {
                                reqbody['password']=this.state.newPassword;
                            }
                            CandyFetch.putIt(
                                `${this.props.apiServer}/users/${this.props.user.username}`,
                                this.props.userToken,
                                reqbody,
                                (data) => {
                                    console.log('user modified');
                                    this.setState({edit: false, currentBio: this.state.newBio, currentRealname: this.state.newRealname});
                                }
                            );
                        }}
                    />
                </CardActions>
            );
            password = (
                <TextField style={{textAlign: 'left'}}
                    floatingLabelText='Password'
                    type='password'
                    fullWidth={true}
                    onChange={(event, newValue) => {
                        this.setState({
                            newPassword: event.target.value
                        });
                    }}
                />
            );
        }
        let editIconBtn=null;
        if (this.props.user && this.props.userToken && this.props.user.username == JSON.parse(atob(this.props.userToken.split('.')[1])).username && !this.state.edit) {
            editIconBtn=(
                <IconButton touch={true}
                    onTouchTap={() => {this.setState({edit: 'true'})}}
                    style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px'
                    }}>
                    <EditorModeEditIcon
                    color={palette.iconGrey} />
                </IconButton>
            );
        }
        return (
            <div className='CandyUserCard' style={{margin: '12px 12px 12px 12px'}}>
                <Card className='fullbleedcard'>



                    <CardText style={{textAlign: 'center', position: 'relative'}}>
                      <Dropzone
                          style={{}}
                          onDrop={this.uploadUserAvatar}
                          disableClick={!this.state.edit}
                          accept="image/*"
                        >
                        <img src={this.props.user.avatar || `${process.env.PUBLIC_URL}/img/defaultavatar.png`} style={{
                            border: this.state.edit ? `4px ${palette.iconGrey} dashed` : 'none',
                            borderRadius: '100%',
                            objectFit: 'cover',
                            width: '170px',
                            height: '170px',
                            margin: 'auto',
                            display: 'block'
                        }} />
                        </Dropzone>
                        <div style={{
                            marginTop: '25px'
                        }}>
                            {editIconBtn}
                            {realname}
                            {username}
                            {joindate}
                            {userbio}
                            {password}
                            {saveBtn}
                        </div>
                    </CardText>

                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyUserCard);
