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
        if(keyCode === 13) {
            this.props.history.push(`/search/${e.target.value}`);
        }
    }
    render() {
        let palette = this.props.muiTheme.palette;
        return(
            <div className="CandySearchBox" style={{
                zIndex: '99',
                position: 'absolute',
                right: '100px',
                top: '0',
                display: 'flex'
            }}>
                <div style={{
                    width: '24px',
                    backgroundImage: `linear-gradient(left, ${palette.primary1Color} 0%, rgba(240,98,146,0) 100%)`,
                    backgroundImage: `linear-gradient(to left, ${palette.primary1Color} 0%, rgba(240,98,146,0) 100%)`,
                }} />
                <TextField
                    style={{
                        backgroundColor: palette.primary1Color,
                        float: 'left',
                        paddingLeft: '6px'
                    }}
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
