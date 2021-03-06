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
                    width={280}
                    open={this.props.open}
                    onRequestChange={this.props.onToggleDrawer}
                    swipeAreaWidth={20}
                    style={{
                        textAlign: 'left'
                    }}
                    >
                        <img src={`${process.env.PUBLIC_URL}/img/header.png`} width={280} />
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/categories/GTK" />}
                            leftIcon={<GtkIcon />}>
                                Gtk themes
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/categories/Qt" />}
                            leftIcon={<QtIcon />}>
                                Qt themes
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/categories/Icons" />}
                            leftIcon={<MapsLayers />}>
                                Icon packs
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/categories/Wallpapers" />}
                            leftIcon={<ImageCollectionsIcon />}>
                                Wallpapers
                        </MenuItem>

                        <Divider />

                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/whatshot" />}
                            leftIcon={<SocialWhatshot />}>
                                What's hot
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/mostpopular" />}
                            leftIcon={<ToggleStarIcon />}>
                                Most popular
                        </MenuItem>
                        <MenuItem onTouchTap={this.props.onToggleDrawer}
                            linkButton
                            containerElement={<Link to="/latest" />}
                            leftIcon={<ActionEventIcon />}>
                                Latest
                        </MenuItem>
                </Drawer>
            </div>
        );
    }
}

export default muiThemeable() (CandyDrawer);
