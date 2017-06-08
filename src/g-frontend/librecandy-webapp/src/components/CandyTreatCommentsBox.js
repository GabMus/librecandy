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
        };
    }

    onCommentTextFieldChange = (event) => {
        this.setState({
            newComment: event.target.value.trim()
        });
    }

    sendComment = (event) => {
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
        console.log(body);
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
                    this.setState({comments: data.treat.comments});
                    document.getElementById('newCommentTextField').value='';
                    //console.log(this.state.latestTreats.treats[0]);
                }
            }
        );
        // TODO: send comment and reload(?) page
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
                        disabled={!this.state.newComment}
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
                                return (
                                    <div key={iter}>
                                        <ListItem
                                            leftAvatar={<Avatar>{comment.author[0].toUpperCase()}</Avatar>}
                                            primaryText={comment.author}
                                            secondaryText={new Date(comment.pub_datetime).toDateString()}
                                            disabled={true}
                                            key={iter}
                                            rightIconButton={
                                                <IconButton
                                                    touch={true}
                                                    onTouchTap={() => {console.log('delete');}}>
                                                    <ActionDeleteForeverIcon color={palette.iconGrey}/>
                                                </IconButton>
                                            }
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
