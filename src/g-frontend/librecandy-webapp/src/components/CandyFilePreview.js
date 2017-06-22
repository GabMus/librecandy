import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class CandyFilePreview extends Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
      <div className="CandyFilePreview">
        <span>{this.props.fileName} </span>
        <button onClick={() => this.props.onRemove(this.props.id)}>Remove</button>
      </div>
    );
  }
}

export default muiThemeable()(CandyFilePreview)
