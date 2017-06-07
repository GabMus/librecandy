import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CandyFilePreview from './CandyFilePreview';
import Dropzone from 'react-dropzone';
import { Image } from 'material-ui-image';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ContentClear from 'material-ui/svg-icons/content/clear';
import '../App.css';

class CandyUploader extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
    }
  }
  renderSelectedFiles = () => {
    console.log(this.state.files)
  }

  onDrop = (files) => {
    this.setState({
      files: this.state.files.concat(files)
    });
  }

  handleRemoveButtonClick = (id) => {
    this.setState({
      files: this.state.files.filter((element, i) => {return id !== i })
    })
  }
  render(){
    return(
      <div >
        <div>
          <GridList
            cellHeight={180}
            style={styles.gridList}
          >

          {this.state.files.map((image, id) => {
            console.log('id: '+id);
            return(
              <GridTile key={id} style={{padding:40}}>
                <ContentClear onClick={() => this.handleRemoveButtonClick(id)} className='removeImageButton'/>
                <img className='previewImage' src={image.preview} />
              </GridTile>
            );
          })
          }

        </GridList>

        </div>
        <Dropzone onDrop={this.onDrop} className='candyUploader'>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>

      </div>
    );
  }
}
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '99%',
    height: 300,
    marginBottom:20,
    overflowY: 'auto',
  },
};
export default muiThemeable()(CandyUploader)
