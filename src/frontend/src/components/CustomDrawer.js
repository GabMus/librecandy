import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import IconMenu from 'material-ui/IconMenu';

export default class CustomDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <IconButton onTouchTap={() => this.handleToggle()} >
          <NavigationMenu />
        </IconButton>
        <Drawer open={this.state.open} docked={false} onRequestChange={((open) => this.setState({open}))}  >
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          {/*TODO Import menuitem from a list which is passed by the parent */}
        </Drawer>
      </div>
    );
  }
}
