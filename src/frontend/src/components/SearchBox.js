import React from 'react';
import SearchIcon from './SearchIcon';
import SearchForm from './SearchForm'

export default class SearchBox extends React.Component{
  constructor(){
    super()
    this.state = {
      isFieldVisible: false
    }
  }
  render(){
    return(
      <div onClick={() => this.setState({isFieldVisible: true})} onBlur={() => this.setState({isFieldVisible: false})}>
          {this.state.isFieldVisible === false ? <SearchIcon/> : <SearchForm/>}
      </div>
    );
  }
}
