import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import ReactMarkdown from 'react-markdown';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import ActionDeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever'

class CandyTreatCommentsBox extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            newComment: '',
            userToken: props.userToken,
            comments: props.comments,
            pkgname: props.pkgname,
            commentPostLock: true,
        };
    }

    onCommentTextFieldChange = (event) => {
        this.setState({
            newComment: event.target.value.trim()
        });
    }

    sendComment = (event) => {
        this.setState({commentPostLock: false});
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
        let body = `content=${this.state.newComment}`;
        let request = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: body
        };
        fetch(`${this.props.apiServer}/treats/${this.state.pkgname}/comments`, request)
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
                    this.setState({comments: data.treat.comments, newComment: ''});
                    document.getElementById('newCommentTextField').value='';
                    //console.log(this.state.latestTreats.treats[0]);
                }
                this.setState({commentPostLock: true});
            }
        );
        // TODO: send comment and reload(?) page
    }

    deleteComment(commentid) {
        let headers = {
            'Access-Control-Allow-Origin':'*',
        };
        if (this.props.userToken) {
            headers['Authorization'] = `JWT ${this.props.userToken}`;
        }
        else {
            console.log('User not logged');
            return;
        }
        let request = {
            method: 'DELETE',
            mode: 'cors',
            headers: headers
        };
        fetch(`${this.props.apiServer}/treats/${this.state.pkgname}/comments/${commentid}`, request)
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
                    this.setState({comments: data.treat.comments});
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
        fetch(`${this.props.apiServer}/users/${username}`, request)
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
        let commentOrLogin = null;
        if (this.state.userToken) {
            commentOrLogin = (
                <div>
                    <TextField
                        id='newCommentTextField'
                        hintText='Write a new comment'
                        multiLine={true}
                        fullWidth={true}
                        onChange={this.onCommentTextFieldChange}
                    />
                    <FlatButton
                        label='Post'
                        primary={true}
                        disabled={!(this.state.newComment && this.state.commentPostLock)}
                        onTouchTap={this.sendComment}
                    />
                </div>
            );
        }
        else {
            commentOrLogin = (<h3>Login or register to comment</h3>);
        }
        let noCommentLabel=null;
        if (this.state.comments.length <= 0) {
            noCommentLabel = (<h3 style={{textAlign: 'center', paddingBottom: '24px'}}>Be the first one to comment!</h3>)
        }
        return (
            <div className='CandyTreatCommentsBox'>
                <Card className='fullbleedcard'>
                    <CardTitle
                        title='Comments'
                    />
                    <CardText>
                        {commentOrLogin}
                    </CardText>
                    <List style={{paddingBottom: '0px'}}>
                        <Divider />
                        {
                            this.state.comments.map((comment, iter) => {
                                let deleteiconbutton=null;
                                if (comment.author == JSON.parse(atob(this.state.userToken.split('.')[1])).username) {
                                    deleteiconbutton = (
                                        <IconButton
                                            touch={true}
                                            onTouchTap={() => {this.deleteComment(comment._id)}}>
                                            <ActionDeleteForeverIcon color={palette.iconGrey}/>
                                        </IconButton>
                                    );
                                }
                                return (
                                    <div key={iter}>
                                        <ListItem
                                            leftAvatar={<Avatar src={this.getUserAvatar(comment.author)}>{comment.author[0].toUpperCase()}</Avatar>}
                                            primaryText={comment.author}
                                            secondaryText={new Date(comment.pub_datetime).toDateString()}
                                            disabled={true}
                                            key={iter}
                                            rightIconButton={deleteiconbutton}
                                        />
                                        <ReactMarkdown
                                            source={comment.content}
                                            className='commentcontent'
                                        />
                                        <Divider />
                                    </div>
                                );
                            })
                        }
                        {noCommentLabel}
                    </List>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatCommentsBox);
