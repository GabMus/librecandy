import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {GtkIcon, QtIcon} from './CandyMatIcons';
import MapsLayers from 'material-ui/svg-icons/maps/layers';
import ImageCollectionsIcon from 'material-ui/svg-icons/image/collections';

import { Link } from 'react-router-dom';

class CandyCategoryIcon extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            category: props.category,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let categoryIcon = null;
        switch (this.state.category) {
            case 'GTK':
                categoryIcon = (<GtkIcon color={palette.iconGrey} style={{float: 'right', width: '24px', height: '24px'}} />);
                break;
            case 'Qt':
                categoryIcon = (<QtIcon color={palette.iconGrey} style={{float: 'right', width: '24px', height: '24px'}} />);
                break;
            case 'Icons':
                categoryIcon = (<MapsLayers color={palette.iconGrey} style={{float: 'right', width: '24px', height: '24px'}} />);
                break;
            case 'Wallpapers':
                categoryIcon = (<ImageCollectionsIcon color={palette.iconGrey} style={{float: 'right', width: '24px', height: '24px'}} />);
                break;
            default:
                categoryIcon = (<GtkIcon color={palette.iconGrey} style={{float: 'right', width: '24px', height: '24px'}} />);
        }
        return (
            <div className='CandyCategoryIcon'>
                {categoryIcon}
            </div>
        );
    }
}

export default muiThemeable() (CandyCategoryIcon);
