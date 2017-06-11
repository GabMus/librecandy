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
import CandySearch from './CandySearch';
import CandyDrawer from './CandyDrawer';
import { Link } from 'react-router-dom';

class CandyToolbar extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            userToken: this.props.userToken,
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
        if (this.state.userToken) {
            loginOrMenu = (
                <IconMenu iconButtonElement={
                    <IconButton touch={true}>
                        <NavigationMoreVertIcon color={palette.alternateTextColor} />
                    </IconButton>
                }>
                    <MenuItem primaryText='New treat'
                        linkButton
                        containerElement={<Link to="/newtreat" />}
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<FileFileUploadIcon />} />
                    <MenuItem primaryText='My treats'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<SocialCakeIcon />} />
                    <MenuItem primaryText='My account'
                        onTouchTap={() => {console.log('menu item selected');}}
                        leftIcon={<SocialPersonIcon />} />
                    <MenuItem primaryText='Logout'
                        onTouchTap={() => {document.cookie='JWT_AUTH='}}
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
                    containerElement={<Link to='/login' className='link' />}
                    >
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
                        <Link to='/' className='link'>
                            <ToolbarTitle text='Librecandy' style={{
                                color: palette.alternateTextColor
                                }}
                            />
                        </Link>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        <CandySearch/>
                        {loginOrMenu}
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}

export default muiThemeable() (CandyToolbar);
