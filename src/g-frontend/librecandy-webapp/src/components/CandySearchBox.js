import TextField from 'material-ui/TextField';
import React, { Component } from 'react';

class CandySearchBox extends Component {

    handleKeyPress = (e) => {
      let keyCode = (e.keyCode) ? e.keyCode : e.which;
      console.log("key press captured");
      if(keyCode === 13){ //Enter key captured
        /*Starting fetch and loading data screen*/
      }
    }
    render(){
      return(
        <div className="CandySearchBox">
          <TextField
            hintText="Search..."
            inputStyle={{color: 'white'}}
            onKeyPress={(e) => this.handleKeyPress(e)}
          autoFocus/>
        </div>
      );
    }
}

export default CandySearchBox;
