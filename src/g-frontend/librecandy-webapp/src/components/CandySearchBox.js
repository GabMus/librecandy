import TextField from 'material-ui/TextField';
import React from 'react';

const CandySearchBox = () =>{
    return(
      <div className="CandySearchBox">
        <TextField
          hintText="Search..."
          inputStyle={{color: 'white'}}
        autoFocus/>
      </div>
    );
}

export default CandySearchBox;
