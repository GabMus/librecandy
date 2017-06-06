import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CandyFilePreview from './CandyFilePreview';
class CandyUploader extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      removeSelection: (id) => {
        let newState = Object.assign([], this.state.files);
        if(newState.length === 1)
          newState = []
        this.setState({files: newState.splice(id, id)})
      }

    }
  }
  renderSelectedFiles = () => {
    console.log(this.state.files)
  }

  handleFileSelect = (e) => {
    this.setState({
      files: this.state.files.concat(e.target.value)
    })
  }

  render(){
    return(
      <div>
        <FlatButton label={this.props.label} primary={true}>
          <input id="imageButton" style={styles.exampleImageInput} type="file" accept="*"
            onChange={this.handleFileSelect} />

        </FlatButton>
        {this.state.files.map((file, id) => {
          return <CandyFilePreview key={id} id={id} fileName={file} onRemove={this.state.removeSelection}/>
        })}
        </div>
    );
  }
}
let styles = {
  exampleImageInput: {
  cursor: 'pointer',
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  width: '100%',
  height:'100',
  opacity: '0'
  }
}
export default muiThemeable()(CandyUploader)
