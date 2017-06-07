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
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';


function checkURL(filename) {
  return(filename.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

/**
 * A contrived example using a transition between steps
 */
class CandyCreateTreat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      treatName: '',
      treatDescription: '',
      treatVersion: '',
      treatCategory: '',
      fileName: '',
      pathFile: '',
      loading: false,
      finished: false,
      stepIndex: 0,
    }
  }

  handleFileInput = (e) =>{
    console.log(e.target);
    if(checkURL(e.target.value))
      this.setState({
              fileName: e.target.value.split("\\").pop(),
              pathFile: e.target.value
            })
    else
      this.setState({
        fileName: 'Choose a valid image'
      })
  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    switch (this.state.stepIndex) {
      case 0:
        let request = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin':'*'
            },
            body: `name=${this.state.treatName}
                  &category=${this.state.treatCategory}
                  &description=${this.state.treatDescription}`

        }
        fetch(`${this.props.apiServer}/treats`,request)
        .then(response =>{
          console.log(response)
        })
        break;
      default:

    }
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
    }
  };


  getTreatCreationForm = () => (
    <div>
    <TextField
        floatingLabelText='Name'
        fullWidth={true}
        onChange={(event, valueName) => {
            this.setState({
                treatName: valueName
            });
        }}
    />
    <TextField
        floatingLabelText='Version'
        fullWidth={true}
        onChange={(event, valueVersion) => {
            this.setState({
                treatVersion: valueVersion
            });
        }}
    />
    <TextField

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
    <FlatButton label='Create Treat' primary={true}>
    </FlatButton>
    </div>
  )

  getScreenshotUploaderForm = () => (
    <div>
      <CandyUploader label='Upload images'/>
    </div>
  )
  /*handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  }*/

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0: //Apparently those returns in case statements are necessary. With break it won't work
        return(
          this.getTreatCreationForm()
        );
      case 1:
        return(
          this.getScreenshotUploaderForm()
        );

      case 2:
        return (
          <p>
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with your
            ads, find out how to tell if they re running and how to resolve approval issues.
          </p>
        );
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

  render() {
    const {loading, stepIndex} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Create your treat</StepLabel>
          </Step>
          <Step>
            <StepLabel>Put screenshots image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Upload your file</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}

export default muiThemeable()(CandyCreateTreat);
