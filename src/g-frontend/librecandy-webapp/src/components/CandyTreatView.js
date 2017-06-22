import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import CandyCategoryIcon from './CandyCategoryIcon';

import ReactStars from 'react-stars'; // doc: https://github.com/n49/react-stars
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star'

import CandyScreenshotGallery from './CandyScreenshotGallery';
import CandyTreatDownloadBox from './CandyTreatDownloadBox';
import CandyTreatCommentsBox from './CandyTreatCommentsBox';
import ReactMarkdown from 'react-markdown';
import { Grid, Row, Col } from 'react-flexbox-grid-aphrodite';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CandyFetch from './../extjs/CandyFetch';
import CandyUploader from './CandyUploader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import ActionDeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Candy404 from './Candy404';

class CandyTreatView extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            edit: false,
            treat: null,
            loaded: false,
            author: null,
            userToken: props.userToken,
            userRating: null,
            newDescription: null,
            versionCreated: null,
            uploadStarted: false,
            uploadFinished: false,
            canSave: true,
            deleteDialogOpen: false,
            deleteNameConfirmation: null,
            deleteNameConfirmationFieldError: null,
            setUploadStarted: () => {
                this.setState({
                    uploadStarted: true,
                    uploadFinished: false,
                    canSave: false
                });
            },
            setUploadFinished: () => {
                this.setState({
                    uploadFinished: true,
                    uploadStarted: false,
                    canSave: true
                });
            },
        };
    }

    componentDidMount() {

        if (!this.state.userRating) {
            this.updateUserRating();
        }
        CandyFetch.getIt(
            `${this.props.apiServer}/treats/${this.props.match.params.pkgname}`,
            this.state.userToken,
            (data) => {
                this.setState({treat: data.treat, author: data.author, newDescription: data.treat.description, loaded: true});
            },
            (errdata) => {
                this.setState({'loaded': true});
            }
        );
    }

    updateUserRating = () => {
        if (!this.state.userToken) return;
        CandyFetch.getIt(
            `${this.props.apiServer}/treats/${this.props.match.params.pkgname}/ratings/fromuser`,
            this.state.userToken,
            (data) => {
                this.setState({userRating: data.rating});
            }
        );
    }

    submitRating = (newRating) => {
        newRating = newRating*2;
        CandyFetch.postIt(
            `${this.props.apiServer}/treats/${this.state.treat.package_name}/ratings`,
            this.state.userToken,
            {
                rating: newRating
            },
            (data) => {
                this.setState({treat: data.treat});
                this.updateUserRating();
            }
        );
    }

    getUserAvatar(username) {
        CandyFetch.getIt(
            `${this.props.apiServer}/users/${this.state.treat.author}`,
            this.state.userToken,
            (data) => {
                return data.avatar;
            }
        );
    }

    createVersion = () => {
      CandyFetch.postIt(
          `${this.props.apiServer}/treats/${this.state.treat.package_name}/versions`,
          this.props.userToken,
          {
              version: this.state.newTreatVersion,
          },
          (data) => {
              if(data.success === false){
                console.log('error while creating the version');
                return;
              }
              this.setState({versionCreated: true})
          }
      );
    }


    render() {
        let palette = this.props.muiTheme.palette;
        if (!this.state.treat && this.state.loaded) {
            return <Candy404 />;
        }
        else if (!this.state.treat && !this.state.loaded) {
            return <div />
        }

        let treatcardtitle= (
            <div style={{lineHeight: '24px', display: 'inline-block'}}>
                <CandyCategoryIcon style={{float: 'left'}} category={this.state.treat.category} />
                <span style={{float: 'left', marginTop: '0', marginBottom: '0', marginLeft: '12px'}}>{this.state.treat.name}</span>
            </div>
        );

        let formattedScreenshots = [];
        for (let i in this.state.treat.screenshots) {
            formattedScreenshots.push({
                original: this.state.treat.screenshots[i],
                originalClass: 'screenshot'
            });
        }

        let screenshot = null;
        let saveButton = null;
        let doneEditingButton = null;
        let deleteTreatButton = null;
        let versioning = null;
        let description = (
            <div style={{marginTop: '24px'}}>
                <ReactMarkdown
                    source={this.state.treat.description}
                    className='treatdescription'
                />
            </div>
        );
        if (this.state.edit) {
            description = (
                <div style={{marginTop: '24px'}}>
                    <TextField
                        floatingLabelText='Description'
                        fullWidth={true}
                        onChange={(event, newValue) => {
                            this.setState({newDescription: event.target.value});
                        }}
                        multiLine={true}
                        value={this.state.newDescription}
                    />
                </div>
            )

            screenshot = (
                <div>
                    <List style={{
                        maxHeight:'560px',
                        overflowY: 'auto'
                    }}>
                        {this.state.treat.screenshots.map((screen, iter) => (
                            <div key={iter}>
                                <ListItem
                                    primaryText={
                                        <img
                                            style={{
                                                objectFit: 'cover',
                                                width:'96px',
                                                height:'54px'
                                            }}
                                            src={screen.file}
                                        />
                                    }
                                    disabled={true}
                                    rightIconButton={
                                        <IconButton
                                            touch={true}
                                            onTouchTap={() => {
                                                CandyFetch.deleteIt(
                                                    `${this.props.apiServer}/treats/${this.state.treat.package_name}/screenshots/${screen.filename}`,
                                                    this.props.userToken,
                                                    (data) => {
                                                        this.setState({
                                                            treat: data.treat
                                                        })
                                                    }
                                                )
                                            }}
                                        >
                                            <ActionDeleteForeverIcon
                                                color={palette.iconGrey}
                                            />
                                        </IconButton>
                                    }

                                />
                                <Divider />
                            </div>
                        ))}
                    </List>
                    <CandyUploader
                        fileType="image"
                        requestKey="screenshot"
                        userToken={this.props.userToken}
                        setUploadFinished={this.state.setUploadFinished}
                        setUploadStarted={this.state.setUploadStarted}
                        requestUrl={`${this.props.apiServer}/treats/${this.state.treat.package_name}/screenshots`}
                        onUploadFinished={(data) => this.setState({treat: data.treat})}
                        label='Upload screenshot'
                        keepAfterUpload={false}
                        allowMultiple={true}
                    />
                </div>
            )

            versioning = (
              <div>
                <div>
                  <div>
                    <TextField
                      floatingLabelText='Version'
                      onChange={(event, newTreatVersion) => {
                          this.setState({newTreatVersion});
                      }}
                    />
                  </div>
                </div>
                <div style={{paddingTop:'24px'}}>
                  <CandyUploader
                      fileType="compressed"
                      requestKey="versionfile"
                      userToken={this.props.userToken}
                      setUploadFinished={this.state.setUploadFinished}
                      setUploadStarted={this.state.setUploadStarted}
                      beforeUpload={() => {
                          this.createVersion();
                      }}
                      enabled={!!this.state.newTreatVersion}
                      onUploadFinished={(data) => this.setState({treat: data.treat})}
                      requestUrl={`${this.props.apiServer}/treats/${this.state.treat.package_name}/versions/${this.state.newTreatVersion}/file`}
                      label='Create version'
                  />
                </div>
              </div>

            )

            saveButton = (
              <RaisedButton
                  label='Save'
                  primary={true}
                  disabled={!this.state.canSave}
                  onTouchTap={() => {
                      CandyFetch.putIt(
                          `${this.props.apiServer}/treats/${this.state.treat.package_name}`,
                          this.state.userToken,
                          {
                              description: this.state.newDescription
                          },
                          (data) => {
                              console.log('treat modified');
                              let newtreat=this.state.treat;
                              newtreat.description=this.state.newDescription;
                              this.setState({treat: newtreat});
                          }
                      );
                  }}
              />
            )
            doneEditingButton = (
                <FlatButton
                    label='Done'
                    secondary={true}
                    onTouchTap={() => {
                        this.setState({edit: false});
                    }}
                />
            )

            deleteTreatButton = (
                <RaisedButton
                    style={{margin:'12px 0 12px 0', display: 'block '}}
                    label='Delete treat'
                    backgroundColor='red'
                    labelColor='white'
                    onTouchTap={() =>{
                        this.setState({deleteDialogOpen: true})
                    }}
                />
            )
        }

        let editBtn=null;
        if (this.state.treat && this.state.userToken && this.state.treat.author == JSON.parse(atob(this.state.userToken.split('.')[1])).username && !this.state.edit) {
            editBtn=(
                <FlatButton touch={true}
                    onTouchTap={() => {this.setState({edit: 'true'})}}
                    secondary={true}
                    label='Edit'
                />
            );
        }
        return (
            <div className='CandyTreatView' style={{ margin: '12px 12px 12px 12px' }}>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <CandyScreenshotGallery
                                screenshots={formattedScreenshots}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={8} lg={8}>
                            <Card className='fullbleedcard'>
                                <CardHeader
                                    title={this.state.author.realname || this.state.author.username}
                                    subtitle={this.state.author.realname && this.state.author.username}
                                    avatar={this.getUserAvatar(this.state.author.username) || ''}
                                />

                                <CardTitle
                                    title={treatcardtitle}
                                />
                                <CardText>
                                    <div style={{lineHeight: '16px', paddingBottom: '7px'}}>
                                        <span style={{float: 'left', paddingRight: '7px'}}>Rate</span>
                                        <ReactStars
                                            count={5}
                                            style={{display: 'block', float: 'left'}}
                                            onChange={this.submitRating}
                                            color2={palette.accent1Color}
                                            size={24}
                                            value={this.state.userRating/2}
                                            edit={!!this.state.userToken ? undefined : false}
                                        />
                                    </div>
                                    <div style={{lineHeight: '14px', display: 'block', paddingBottom: '24px'}}>
                                        <ToggleStarIcon color={palette.iconGrey} style={{width: '14px', height: '14px', float: 'left'}} />
                                        <span style={{float: 'left', paddingLeft: '7px'}}>{this.state.treat.total_rating/2}</span>
                                    </div>
                                    <div style={{position: 'relative'}}>
                                        {editBtn}
                                        {description}
                                        {saveButton}
                                        {screenshot}
                                        {versioning}
                                        {deleteTreatButton}
                                        {doneEditingButton}
                                        <Dialog
                                          title="Delete treat"
                                          actions={[
                                              <FlatButton
                                                  label='Cancel'
                                                  secondary={true}
                                                  onTouchTap={() => {
                                                      this.setState({deleteDialogOpen: false});
                                                  }}
                                              />,
                                              <RaisedButton
                                                  label='Delete treat'
                                                  primary={true}
                                                  onTouchTap={() => {
                                                      if (this.state.deleteNameConfirmation==this.state.treat.name) {
                                                          CandyFetch.deleteIt(
                                                              `${this.props.apiServer}/treats/${this.state.treat.package_name}`,
                                                              this.props.userToken,
                                                              (data) => {
                                                                  if (data.success===false) {
                                                                      this.setState({deleteNameConfirmationFieldError: data.message});
                                                                  }
                                                                  else {
                                                                      this.props.history.push('/');
                                                                  }
                                                              }
                                                          );
                                                      }
                                                      else {
                                                          this.setState({deleteNameConfirmationFieldError: 'The name does not match'});
                                                      }
                                                  }}
                                              />
                                          ]}
                                          modal={true}
                                          open={this.state.deleteDialogOpen}
                                        >
                                          <TextField
                                              errorText={this.state.deleteNameConfirmationFieldError}
                                              floatingLabelText='Insert the treat name to confirm'
                                              fullWidth={true}
                                              onChange={(event, newValue) => {
                                                  this.setState({deleteNameConfirmation: event.target.value});
                                              }}
                                          />
                                        </Dialog>
                                    </div>
                                </CardText>
                            </Card>
                        </Col>
                        <Col xs={12} md={4} lg={4}>
                            <CandyTreatDownloadBox
                                treat={this.state.treat}
                                userToken={this.props.userToken}
                                apiServer={this.props.apiServer}
                                edit={this.state.edit}
                                onVersionDelete={(data) => {
                                    this.setState({treat: data.treat});
                                }}
                                onVersionDeprecateToggle={(data) => {
                                    this.setState({treat: data.treat});
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <CandyTreatCommentsBox
                                userToken={this.state.userToken}
                                comments={this.state.treat.comments}
                                apiServer={this.props.apiServer}
                                pkgname={this.state.treat.package_name}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatView);
