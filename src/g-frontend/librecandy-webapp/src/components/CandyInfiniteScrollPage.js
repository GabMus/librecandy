import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ReactMarkdown from 'react-markdown';
import CandyHorizontalCardview from './CandyHorizontalCardview';

import InfiniteScroll from 'react-infinite-scroller';

class CandyInfiniteScrollPage extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            infiniteLoadingLock: true,
            label: this.props.label || 'VIEW_NAME',
            leftIcon: this.props.leftIcon,
            treats: this.props.treats || [
            ]
        };
    }


    render() {
        let loadMoreFunc = () => {
            let oldtreats = this.state.treats.slice();
            let newtreats = [{
                name: 'Wall',
                total_rating: 6,
                screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                author: 'gabmus',
                category: 'Wallpapers'
            },
            {
                name: 'Theme',
                total_rating: 8,
                screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                author: 'gabmus',
                category: 'GTK'
            },
            {
                name: 'Iconium',
                total_rating: 9,
                screenshots: [{file: 'http://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9'}],
                author: 'gabmus',
                category: 'Icons'
            }];
            this.setState({
                infiniteLoadingLock: false,
                treats: [...oldtreats, ...newtreats]
            }, () => {
                this.setState({infiniteLoadingLock: true})
            });
        }
        let palette = this.props.muiTheme.palette;
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
                        leftIcon={this.state.leftIcon}
                    />
                </InfiniteScroll>
            </div>
        );
    }
}

export default muiThemeable() (CandyInfiniteScrollPage);
