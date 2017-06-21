import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import ReactMarkdown from 'react-markdown';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import IconButton from 'material-ui/IconButton';
import ActionDeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';

import CandyFetch from './../extjs/CandyFetch';

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
        CandyFetch.postIt(
            `${this.props.apiServer}/treats/${this.state.pkgname}/comments`,
            this.props.userToken,
            {
                content: this.state.newComment
            },
            (data) => {
                this.setState({comments: data.treat.comments, newComment: ''});
                document.getElementById('newCommentTextField').value='';
                this.setState({commentPostLock: true});
            }
        );
    }

    deleteComment(commentid) {
        CandyFetch.deleteIt(
            `${this.props.apiServer}/treats/${this.state.pkgname}/comments/${commentid}`,
            this.props.userToken,
            (data) => {
                this.setState({comments: data.treat.comments});
            }
        );
    }

    getUserAvatar(username) {
        CandyFetch.getIt(
            `${this.props.apiServer}/users/${username}`,
            this.props.userToken,
            (data) => {
                return data.avatar
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
                    <div style={{
                        marginLeft: 'auto',
                        display: 'table'
                    }}>
                        <RaisedButton
                            label='Post'
                            primary={true}
                            disabled={!(this.state.newComment && this.state.commentPostLock)}
                            onTouchTap={this.sendComment}
                        />
                    </div>
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
                                if (this.state.userToken && comment.author == JSON.parse(atob(this.state.userToken.split('.')[1])).username) {
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
