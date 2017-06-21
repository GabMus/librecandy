import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CandyFilePreview from './CandyFilePreview';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import { Image } from 'material-ui-image';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FileCloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import CandyFetch from '../extjs/CandyFetch';
import '../App.css';

class CandyUploader extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      uploaded: [],
      accepted: ''
    }
  }

  onDrop = (files) => {
    if(this.props.allowMultiple)
      this.setState({
        files: this.state.files.concat(files)
      });
    else
      this.setState({ files })
  }

  handleRemoveButtonClick = (id) => {
    this.setState({
      files: this.state.files.filter((element, i) => {return id !== i })
    })
  }

  handleEndOfUpload = () => {
    this.props.setUploadFinished()
    this.setState({uploaded: this.state.files, files: []})
  }

  uploadFiles = () => {
    this.props.setUploadStarted()
    let fileProcessed = 0;
    for(let i = 0; i < this.state.files.length; i++){
      let formData = new FormData();
      formData.append(this.props.requestKey,this.state.files[i])
      let headers = {};
      if (this.props.userToken)
          headers['Authorization'] = `JWT ${this.props.userToken}`;
      else {
          console.log('User not logged');
          return;
      }
      let body = `${formData}`
      let request = {
          method: 'POST',
          mode: 'cors',
          headers: headers,
          body: formData
      };
      fetch(this.props.requestUrl, request)
      .then(response => {return response.json()})
      .then(data => {
        console.log('File uploaded')
        fileProcessed++;
        if(fileProcessed === this.state.files.length){
          this.handleEndOfUpload()
          console.log('All files were uploaded');

        }
        console.log(data)
      })
      .catch(error => console.log(error))

    }
  }

  componentWillMount(){
    switch(this.props.fileType){
      case 'image':
        this.setState({accepted: 'image/*'})
        break;
      case 'compressed':
        this.setState({accepted: 'application/zip'})
        break;
    }
  }


  printFileContainer = () => {
    switch(this.props.fileType){
      case 'image':
        return(
          <div>
          <GridList
            cellHeight={180}
            style={styles.gridList}
          >

          {this.state.files.map((image, id) => {
            console.log('image: ',image)
            console.log('id: '+id);
            return(
              <GridTile key={id} style={{padding:40}}>
                <ContentClear onClick={() => this.handleRemoveButtonClick(id)} className='removeImageButton'/>
                <img className='previewImage' src={image.preview} />
              </GridTile>
            );
          })
          }
          {this.state.uploaded.map((image, id) => { //insert an icon for the upload
            return(
              <GridTile key={id} style={{padding:40}}>
                <img className='previewImage' src={image.preview} />
              </GridTile>
            );
          })
          }

        </GridList>
          <FileCloudUploadIcon
            color={this.props.muiTheme.palette.iconGrey}
            style={{
                height: '40%',
                width: '40%',
                position: 'absolute',
                top: '10%',
                left: '0',
                right: '0',
                marginLeft: 'auto',
                marginRight: 'auto',
                zIndex: '-9999'
            }}
          />
          </div>
        )
        break;
      case 'compressed':
        return(
        <div>
        {
          this.state.files.map((file, id) => {
            return(
              <div key={id} style={{padding:40}}>
                <span>{file.name}</span>
              </div>
            );
          })
        }
        </div>
      );
      default:
        break;
    }



  }
  render(){
    return(
      <div>
      <div style={{
          border: `2px ${this.props.muiTheme.palette.iconGrey} solid`,
          borderRadius: '5px'
      }}>
        <div>
          {this.printFileContainer()}
        </div>
        <Dropzone
              onDrop={this.onDrop}
              accept={this.state.accepted}
              className='candyUploader'
              >

          <p>Drop your files here, or click to select files to upload.</p>
        </Dropzone>
          </div>
          <RaisedButton
            label='Upload'
            primary={true}
            onTouchTap={this.uploadFiles}
            disabled={(this.state.files.length > 0 ? false : true)}
            style={{marginTop:20}}
          />

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
