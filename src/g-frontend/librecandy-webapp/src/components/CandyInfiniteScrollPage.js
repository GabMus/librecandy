import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';
import CandyHorizontalCardview from './CandyHorizontalCardview';

import InfiniteScroll from 'react-infinite-scroller';

import SocialWhatshotIcon from 'material-ui/svg-icons/social/whatshot';
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star';
import ActionEventIcon from 'material-ui/svg-icons/action/event';

import CandyFetch from './../extjs/CandyFetch';

class CandyInfiniteScrollPage extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            infiniteLoadingLock: true,
            label: this.props.label || 'VIEW_NAME',
            treats: [],
            fetchurl: this.props.fetchurl || `${this.props.apiServer}/treats`
        };
        this.offset=0;
    }


    render() {
        let loadMoreFunc = () => {
            let oldtreats = this.state.treats.slice();
            CandyFetch.getIt(
                `${this.props.apiServer}/${this.state.fetchurl}${this.state.fetchurl.includes('/search') ? '&' : '?'}limit=10&offset=${this.offset}`,
                this.state.userToken,
                (data) => {
                    this.setState({
                        infiniteLoadingLock: false,
                        treats: [...oldtreats, ...data.treats]
                    }, () => {
                        this.offset=this.offset+10;
                        if (data.treats.length!=0) {
                            this.setState({infiniteLoadingLock: true})
                        }
                    });
                }
            );
        }
        let palette = this.props.muiTheme.palette;
        let sectionHeaderIconStyle = {
            width: '48px',
            height: '48px',
            float: 'left',
            marginRight: '12px'
        };
        let leftIcon = null;
        switch (this.state.label) {
            case 'What\'s hot':
                leftIcon = (<SocialWhatshotIcon style={sectionHeaderIconStyle}/>);
                break;
            case 'Most popular':
                leftIcon = (<ToggleStarIcon style={sectionHeaderIconStyle}/>);
                break;
            case 'Latest':
                leftIcon = (<ActionEventIcon style={sectionHeaderIconStyle}/>);
                break;
            default:
                leftIcon = null;
        }
        return (
            <div className='CandyInfiniteScrollPage' style={{ margin: '12px 12px 12px 12px' }}>
                <InfiniteScroll
                    loadMore={loadMoreFunc}
                    hasMore={this.state.infiniteLoadingLock}
                    useWindow={true}
                    threshold={100}
                >
                    <CandyHorizontalCardview
                        treats={this.state.treats}
                        seemore={false}
                        label={this.state.label}
                        leftIcon={leftIcon}
                    />
                </InfiniteScroll>
            </div>
        );
    }
}

export default muiThemeable() (CandyInfiniteScrollPage);
