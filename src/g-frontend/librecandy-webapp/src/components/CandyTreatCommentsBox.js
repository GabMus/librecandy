import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import ReactMarkdown from 'react-markdown';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class CandyTreatCommentsBox extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            newComment: '',
            userLogged: props.userLogged || true,
            comments: props.comments || [
                { // test data
                    author: 'gabmus',
                    pub_datetime: 'May 24th, 2017, 10:17',
                    content: 'Lorem ipsum dolor sit amet'
                },
                { // test data
                    author: 'xmey95',
                    pub_datetime: 'May 24th, 2017, 9:43',
                    content: 'Some other shit I wont bother coming up with'
                },
            ],
        };
    }

    onCommentTextFieldChange = (event) => {
        this.setState({
            newComment: event.target.value.trim()
        });
    }

    sendComment = (event) => {
        console.log(this.state.newComment);
        // TODO: send comment and reload(?) page
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let commentOrLogin = null;
        if (this.state.userLogged) {
            commentOrLogin = (
                <div>
                    <TextField
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
            commentOrLogin = (<span style={{fontSize: '14pt'}}>Login or register to comment</span>);
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
                                    <div>
                                        <ListItem
                                            leftAvatar={<Avatar>{comment.author[0].toUpperCase()}</Avatar>}
                                            primaryText={comment.author}
                                            secondaryText={comment.pub_datetime}
                                            disabled={true}
                                            key={iter}
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
                    </List>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatCommentsBox);
