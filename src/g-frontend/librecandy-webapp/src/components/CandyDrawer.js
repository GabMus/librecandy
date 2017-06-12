import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {GtkIcon, QtIcon} from './CandyMatIcons';
import MapsLayers from 'material-ui/svg-icons/maps/layers';
import ImageCollectionsIcon from 'material-ui/svg-icons/image/collections';
import SocialWhatshot from 'material-ui/svg-icons/social/whatshot';
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star';
import ActionEventIcon from 'material-ui/svg-icons/action/event';
import { Link } from 'react-router-dom';

class CandyDrawer extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {open: false};
    }

    render() {


        let palette = this.props.muiTheme.palette;
        return (
            <div className='CandyDrawer'>
                <Drawer
                    docked={false}
                    width={250}
                    open={this.props.open}
                    onRequestChange={this.props.onToggleDrawer}
                    swipeAreaWidth={20}
                    style={{
                        textAlign: 'left'
                    }}
                    >
                        <img src='https://www.w3schools.com/w3images/fjords.jpg' width={250} />
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            leftIcon={<GtkIcon />}>
                                Gtk themes
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            leftIcon={<QtIcon />}>
                                Qt themes
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            leftIcon={<MapsLayers />}>
                                Icon packs
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            leftIcon={<ImageCollectionsIcon />}>
                                Wallpapers
                        </MenuItem>

                        <Divider />

                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/treats/whatshot" />}
                            leftIcon={<SocialWhatshot />}>
                                What's hot
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/treats/mostpopular" />}
                            leftIcon={<ToggleStarIcon />}>
                                Most popular
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/treats/latest" />}
                            leftIcon={<ActionEventIcon />}>
                                Latest
                        </MenuItem>
                </Drawer>
            </div>
        );
    }
}

export default muiThemeable() (CandyDrawer);
