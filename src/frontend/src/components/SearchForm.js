import React from 'react';
import TextField from 'material-ui/TextField';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import '../App.css';
class SearchForm extends React.Component{

  render(){
    return(
      <CSSTransitionGroup
        transitionName="searchbox"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnterTimeout={1500}
        transitionLeaveTimeout={1500}>
        <TextField id="searchField" hintText="Search theme" autoFocus/>
      </CSSTransitionGroup>
    );
  }
}

export default SearchForm;
