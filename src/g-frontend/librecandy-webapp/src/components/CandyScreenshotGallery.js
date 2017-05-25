import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ImageNavigateNextIcon from 'material-ui/svg-icons/image/navigate-next'
import ImageNavigateBeforeIcon from 'material-ui/svg-icons/image/navigate-before'

import ImageGallery from 'react-image-gallery';

class CandyScreenshotGallery extends Component {
    //TODO remove in production
    test_images = [
        {
            original: 'https://www.unixmen.com/wp-content/uploads/2015/10/Linux.jpg',
            originalClass: 'screenshot'
        },
        {
            original: 'https://regmedia.co.uk/2015/12/11/linux_and_windows.jpg?x=1200&y=794',
            originalClass: 'screenshot'
        },
        {
            original: 'https://www.ipvanish.com/images/a/vpnsetup/linux.png',
            originalClass: 'screenshot'
        },
        {
            original: 'http://i.bnet.com/blogs/vertical_farm_in_desert_chris_jacobs.jpg',
            originalClass: 'screenshot'
        },
        {
            original: 'http://t.wallpaperweb.org/wallpaper/nature/3840x1024/9XMedia1280TripleHorizontalMountainsclouds.jpg',
            originalClass: 'screenshot'
        }
    ];

    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            screenshots: this.props.screenshots || this.test_images || []
        };
    }

    render() {

        let palette = this.props.muiTheme.palette;

        let controlIconStyle = {width: '48px', height: '48px'};
        let controlButtonStyle = {
            width: '96px',
            height: '96px',
            padding: '24px',
            zIndex: '9999',
            position: 'absolute',
            bottom: '0',
            left: '50%'
        };

        let controlButtonLeft = Object.assign(Object.assign({}, controlButtonStyle), {
            transform: 'translate(-90%, 0)'
        });

        let controlButtonRight = Object.assign(Object.assign({}, controlButtonStyle), {
            transform: 'translate(-10%, 0)'
        });

        return (
            <div className='CandyScreenshotGallery'>
                <div style={{ display: 'block' }}>
                    <Card className='fullbleedcard' style={{
                        color: palette.alternateTextColor
                    }}>
                        <ImageGallery
                            items={this.state.screenshots}
                            showThumbnails={false}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            renderLeftNav={
                                (onClick, disabled) => {
                                    return (
                                        <IconButton touch={true} onTouchTap={() => {onClick();}} iconStyle={controlIconStyle} style={controlButtonLeft}>
                                            <ImageNavigateBeforeIcon color={palette.alternateTextColor} />
                                        </IconButton>
                                    )
                                }
                            }
                            renderRightNav={
                                (onClick, disabled) => {
                                    return (
                                        <IconButton touch={true} onTouchTap={() => {onClick();}} iconStyle={controlIconStyle} style={controlButtonRight}>
                                            <ImageNavigateNextIcon color={palette.alternateTextColor} />
                                        </IconButton>
                                    )
                                }
                            }
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default muiThemeable() (CandyScreenshotGallery);
