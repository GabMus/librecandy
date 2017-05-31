import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';

class CandySearchBox extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    handleKeyPress = (e) => {
        let keyCode = (e.keyCode) ? e.keyCode : e.which;
        console.log("key press captured");
        if(keyCode === 13){ //Enter key captured
            /*Starting fetch and loading data screen*/
        }
    }
    render() {
        let palette = this.props.muiTheme.palette;
        return(
            <div className="CandySearchBox">
                <TextField
                    hintText="Search..."
                    inputStyle={{color: palette.alternateTextColor}}
                    underlineFocusStyle={{borderColor: palette.alternateTextColor}}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    autoFocus
                />
            </div>
        );
    }
}

export default muiThemeable() (CandySearchBox);
