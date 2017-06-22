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
      if(this.props.beforeUpload){
          this.props.beforeUpload();
      }
      fetch(this.props.requestUrl, request)
      .then(response => {return response.json()})
      .then(data => {
        fileProcessed++;
        if(fileProcessed === this.state.files.length){
          this.handleEndOfUpload();
          if(this.props.onUploadFinished){
              this.props.onUploadFinished(data);
          }
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
        this.setState({accepted: '.zip, .tar.gz, .tar.xz, .7z'})
        break;
    }
  }

    renderUploadedFiles = () => {
        if(this.props.keepAfterUpload){
            return(this.state.uploaded.map((image, id) => { //insert an icon for the upload
                return(
                    <GridTile key={id} style={{padding:40}}>
                        <img className='previewImage' src={image.preview} />
                    </GridTile>
                );
            }))
        }else{
            return(<GridList></GridList>)
        }
    }

    printFileContainer = () => {
    switch(this.props.fileType){
      case 'image':
        return(
          <div style={this.props.style}>
          <GridList
            style={{...styles.gridList, height: 'auto', maxHeight: '300px', minHeight: '140px'}}
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

          {this.renderUploadedFiles()}

        </GridList>
          </div>
        )
        break;
      case 'compressed':
        return(
        <div>
        {
          this.state.files.map((file, id) => {
            return(
              <div key={id} style={{padding:20}}>
              <ContentClear onClick={() => this.handleRemoveButtonClick(id)} className='removeFileButton'/>
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
          borderRadius: '5px',
          padding: '2px'
      }}>
        <div>
          {this.printFileContainer()}
        </div>
        <Dropzone
              onDrop={this.onDrop}
              accept={this.state.accepted}

              className='candyUploader'
              >

          <div style={{
              padding: '50px 0 50px 0',
              margin: 'auto',
              width: '98%',
              border: `2px ${this.props.muiTheme.palette.iconGrey} dashed`
          }}>
              Drop your files here, or click to select files to upload.
          </div>
        </Dropzone>
          </div>
          <RaisedButton
            label={this.props.label}
            primary={true}
            onTouchTap={this.uploadFiles}
            disabled={!this.state.files.length || !this.props.enabled}
            style={{marginTop:20}}
          />

      </div>
    );

  }

  static defaultProps = {
    allowMultiple: false,
    keepAfterUpload: true,
    enabled: true,
    label: 'Upload'
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
