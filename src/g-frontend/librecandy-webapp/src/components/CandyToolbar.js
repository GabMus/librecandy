import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationMenuIcon from 'material-ui/svg-icons/navigation/menu';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import NavigationMoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SocialPersonIcon from 'material-ui/svg-icons/social/person';
import SocialCakeIcon from 'material-ui/svg-icons/social/cake';
import ActionExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import FileFileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import muiThemeable from 'material-ui/styles/muiThemeable';

import CandyDrawer from './CandyDrawer';

class CandyToolbar extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            userLogged: false,
            searchbarActive: false,
            open: false,
        };
    }

    toggleChildDrawer() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let loginOrMenu = null;
        if (this.state.userLogged || true) {
            loginOrMenu = (
                <IconMenu iconButtonElement={
                    <IconButton touch={true}>
                        <NavigationMoreVertIcon color={palette.alternateTextColor} />
                    </IconButton>
                }>
                    <MenuItem primaryText='New treat'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<FileFileUploadIcon />} />
                    <MenuItem primaryText='My treats'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<SocialCakeIcon />} />
                    <MenuItem primaryText='My account'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<SocialPersonIcon />} />
                    <MenuItem primaryText='Logout'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<ActionExitToAppIcon />} />
                </IconMenu>
            );
        }
        else {
            loginOrMenu = (
                <FlatButton label='Login'
                    style={{
                        color: palette.alternateTextColor
                    }}
                    onTouchTap={() => {console.log('login action');}}>
                </FlatButton>
            );
        }
        return (
            <div className='CandyToolbar'>
                <CandyDrawer open={this.state.open} onToggleDrawer={this.toggleChildDrawer.bind(this)}>
                </CandyDrawer>
                <Toolbar className='CandyToolbarToolbar' style={{
                    backgroundColor: palette.primary1Color
                }}>
                    <ToolbarGroup firstChild={true}>
                        <IconButton touch={true} onTouchTap={this.toggleChildDrawer.bind(this)}>
                            <NavigationMenuIcon color={palette.alternateTextColor} />
                        </IconButton>
                        <ToolbarTitle text='Librecandy' style={{
                            color: palette.alternateTextColor
                        }} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        <IconButton touch={true} onTouchTap={() => {console.log('search action');}}>
                            <ActionSearchIcon color={palette.alternateTextColor} />
                        </IconButton>
                        {loginOrMenu}
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}

export default muiThemeable() (CandyToolbar);
