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
import MenuItem from 'material-ui/MenuItem'

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
      treatCategories: [],
      treatPackageName: '',
      fileName: '',
      pathFile: '',
      loading: false,
      finished: false,
      stepIndex: 0,
    }
  }

  componentWillMount(){
    fetch(`${this.props.apiServer}/treats/categories`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log('componentWillMount')
      this.setState({
        treatCategories: data.categories
      })
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
        let headers = {
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        if (this.props.userToken) {
            headers['Authorization'] = `JWT ${this.props.userToken}`;
        }
        else {
            console.log('User not logged');
            return;
        }
        let body = `name=${this.state.treatName}&category=${this.state.treatCategory}&description=${this.state.treatDescription}`
        let request = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: body
        };
        fetch(`${this.props.apiServer}/treats`,request)
        .then(response => {
          console.log(this.props.userToken)
          return response.json();
        })
        .then(data => {
          this.setState({treatPackageName: data.treat.package_name})
          //console.log(data.treat.package_name)
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

  handleChange = (event, index, treatCategory) => {
    this.setState({treatCategory})
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
                    console.log('Category: '+category)
                    return <MenuItem key={index} value={category} primaryText={category} />
                })
            }
        </DropDownMenu>
    </div>

    </div>
  )

  getScreenshotUploaderForm = () => {
    console.log(this.state.treatCategories)
    return (

    <div>
      <CandyUploader apiServer={this.props.apiServer} packageName={this.state.treatPackageName} label='Upload images'/>
    </div>
  )}
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
              Load files placeholder
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
                  {this.renderStepControls(1)}
                </div>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Upload your file</StepLabel>
            <StepContent>
                <div style={contentStyle}>
                  <div>{this.getStepContent(2)}</div>
                  {this.renderStepControls(2)}
                </div>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}

export default muiThemeable()(CandyCreateTreat);
