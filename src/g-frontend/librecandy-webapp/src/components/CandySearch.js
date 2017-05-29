import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import CandySearchBox from './CandySearchBox';

class CandySearch extends Component{
  constructor(props){
    super(props);
    this.state = {
      isSearchActive: false
    }
  }

  render(){
    if(this.state.isSearchActive){
      /*Manage key press for fetch request*/
    }
    return(
      <div onClick={() => this.setState({isSearchActive: true})}
           onBlur={() => this.setState({isSearchActive: false})}>
        {(this.state.isSearchActive === false) ? <IconButton><ActionSearchIcon color={'white'}/></IconButton> : <CandySearchBox/>}
      </div>
    );
  }
}

export default CandySearch;
