import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import SearchBox from './SearchBox';

injectTapEventPlugin();


class CustomToolbar extends Component {

  render() {
    return (
      <div>

      <Toolbar>
        <ToolbarGroup>
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationMenu />
              </IconButton>
            }>
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
          <ToolbarTitle text="Librecandy"/>
        </ToolbarGroup>
        <ToolbarGroup>
          <SearchBox/>
        </ToolbarGroup>
      </Toolbar>
      </div>
    );
  }
}

export default CustomToolbar;
