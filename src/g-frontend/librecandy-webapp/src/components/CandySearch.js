import React, {Component} from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import TextField from 'material-ui/TextField';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import CandySearchBox from './CandySearchBox';

class CandySearch extends Component{
    constructor(props){
        super(props);
        this.props=props;
        this.state = {
            isSearchActive: false
        }
    }

    render(){

        if(this.state.isSearchActive){
            /*Manage key press for fetch request*/
        }
        return(
            <div
                onTouchTap={() => this.setState({isSearchActive: true})}
                onBlur={() => this.setState({isSearchActive: false})}>
                {(this.state.isSearchActive === false) ? <IconButton><ActionSearchIcon color={'white'}/></IconButton> : <CandySearchBox history={this.props.history} />}
            </div>
        );
    }
}

export default muiThemeable() (CandySearch);
