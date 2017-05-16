import React from 'react';
import Search from 'material-ui/svg-icons/action/search';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

const SearchIcon = () => {
  return(
    <CSSTransitionGroup
      transitionName="searchbox"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnterTimeout={1500}
      transitionLeaveTimeout={1500}>
      <Search/>
    </CSSTransitionGroup>
  );
}

export default SearchIcon;
