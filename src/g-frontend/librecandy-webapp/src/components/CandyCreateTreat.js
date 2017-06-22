import React, { Component } from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import CandyUploader from './CandyUploader';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import CandyFetch from './../extjs/CandyFetch';


/**
 * A contrived example using a transition between steps
 */
class CandyCreateTreat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nameError: null,
      descriptionError: null,
      versionError: null,
      treatName: '',
      treatDescription: '',
      treatVersion: '',
      treatCategory: 'Qt',
      treatCategories: [],
      treatPackageName: '',
      fileName: '',
      pathFile: '',
      uploadStarted: false,
      uploadFinished: false,
      setUploadStarted: () => {
        this.setState({
          uploadStarted: true,
          uploadFinished: false,
          canContinue: false
        })
      },
      setUploadFinished: () => {
        this.setState({
          uploadFinished: true,
          uploadStarted: false,
          canContinue: true
        })
      },
      versionCreated: false,
      loading: false,
      finished: false,
      stepIndex: 0,
    }
  }

  componentWillMount(){
      CandyFetch.getIt(
          `${this.props.apiServer}/treats/categories`,
          null,
          (data) => {
              this.setState({
                  treatCategories: data.categories
              });
          }
      );
  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext = () => {
      const {stepIndex, loading, finished} = this.state;
      switch (this.state.stepIndex) {
          case 0:
          this.setState({loading: true})
          CandyFetch.postIt(
              `${this.props.apiServer}/treats`,
              this.props.userToken,
              {
                  name: this.state.treatName,
                  category: this.state.treatCategory,
                  description: this.state.treatDescription
              },
              (data) => {
                if (data.success===false) {
                    console.log(data);
                    this.setState({
                        nameError: data.message,
                        descriptionError: data.message,
                    });
                    return;
                }
                else if  ('code' in data) {
                    this.setState({
                        nameError: 'A treat with this name already exists for this user',
                    });
                    return;
                }
                else this.setState({
                    nameError: null,
                    descriptionError: null,
                });
                this.setState({treatPackageName: data.treat.package_name});
                this.dummyAsync(() => this.setState({
                  loading: false,
                  stepIndex: stepIndex + 1,
                  finished: stepIndex >= 2,
                }));
              }
          );
          break;
          case 2:
            this.props.history.push(`/treat/${this.state.treatPackageName}`);
            break;
          default:
            this.dummyAsync(() => this.setState({
              loading: false,
              stepIndex: stepIndex + 1,
              finished: stepIndex >= 2,
            }));

    }

  };



  handleChange = (event, index, treatCategory) => {
    this.setState({treatCategory})
  };

  getTreatCreationForm = () => (
    <div>
    <TextField
        errorText={this.state.nameError}
        floatingLabelText='Name'
        fullWidth={true}
        onChange={(event, valueName) => {
            this.setState({
                treatName: valueName
            });
        }}
    />
    <TextField
        errorText={this.state.descriptionError}
        floatingLabelText="Description"
        multiLine={true}
        fullWidth={true}
        rows={3}
        onChange={(event, valueDescription) => {
          this.setState({
              treatDescription: valueDescription
          });
        }}
        />
    <div style={{
        lineHeight: '54px',
        padding: '24px 0 72px 0'
    }}>
        <span
            style={{
                float: 'left',
            }}
        >
            Category:
        </span>
        <DropDownMenu
            style={{
                float: 'left',
            }}
            value={this.state.treatCategory}
            onChange={this.handleChange}>
            {
                this.state.treatCategories.map((category, index) => {
                    return <MenuItem key={index} value={category} primaryText={category} />
                })
            }
        </DropDownMenu>
    </div>

    </div>
  )

  getScreenshotUploaderForm = () => {
    return (
      <div>
        <CandyUploader
            fileType="image"
            requestKey="screenshot"
            userToken={this.props.userToken}
            setUploadFinished={this.state.setUploadFinished}
            setUploadStarted={this.state.setUploadStarted}
            requestUrl={`${this.props.apiServer}/treats/${this.state.treatPackageName}/screenshots`}
            label='Upload images'
            allowMultiple={true}
        />
      </div>
  )}

  createVersion = () => {
    CandyFetch.postIt(
        `${this.props.apiServer}/treats/${this.state.treatPackageName}/versions`,
        this.props.userToken,
        {
            version: this.state.newTreatVersion,
        },
        (data) => {
            if (data.success===false) {
                this.setState({
                    versionError: data.message,
                });
                return;
            }
            else this.setState({
                versionError: true,
            });
            this.setState({versionCreated: true})
        }
    );
  }

  getVersionCreationForm = () => {
      return(
        <div>
          <div>
            <div>
              <TextField
                errorText={this.state.versionError}
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
                requestUrl={`${this.props.apiServer}/treats/${this.state.treatPackageName}/versions/${this.state.newTreatVersion}/file`}
                label='Create version'
            />
          </div>
        </div>

      )
  }

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0: //Apparently those returns in case statements are necessary. With break it won't work
        return(
          this.getTreatCreationForm()
        );
        break;
      case 1:
        return(
          this.getScreenshotUploaderForm()
        );
        break;
      case 2:
        return(
            this.getVersionCreationForm()
        );
        break;
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};
    const {finished, stepIndex} = this.state;

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Click here
            </a> to reset the example.
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }

  renderStepControls(stepIndex, canContinue=true) {
      return (
          <div style={{marginTop: 24, marginBottom: 12}}>
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              onTouchTap={this.handlePrev}
              style={{marginRight: 12}}
            />
            <RaisedButton
              label={stepIndex === 2 ? 'Finish' : 'Next'}
              disabled={!canContinue}
              primary={true}
              onTouchTap={this.handleNext}
            />
          </div>
      )
  }

  render() {
    const {loading, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};


    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex} orientation='vertical'>
          <Step>
            <StepLabel>Create your treat</StepLabel>
            <StepContent>
                <div style={contentStyle}>
                  <div>{this.getStepContent(0)}</div>
                  {this.renderStepControls(0, (this.state.treatName.length > 0 && this.state.treatDescription.length > 0))}
                </div>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Put screenshots image</StepLabel>
            <StepContent>
                <div style={contentStyle}>
                  <div>{this.getStepContent(1)}</div>
                  {this.renderStepControls(1, this.state.canContinue)}
                </div>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Create version and upload treat</StepLabel>
            <StepContent>
                <div style={contentStyle}>
                  <div>{this.getStepContent(2)}</div>
                  {this.renderStepControls(2, this.state.canContinue)}
                </div>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );

  }
}

export default muiThemeable()(CandyCreateTreat);
