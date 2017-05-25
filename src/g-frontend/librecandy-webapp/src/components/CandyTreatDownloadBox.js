import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FileFileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

class CandyTreatDownloadBox extends Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state = {
            versions: props.versions || [
                { // test data
                    version: '1.1',
                    pub_datetime: 'May 24th, 2017',
                    is_deprecated: false
                },
                {
                    version: '1.0',
                    pub_datetime: 'May 20th, 2017',
                    is_deprecated: false
                },
                {
                    version: '0.8',
                    pub_datetime: 'April 2nd, 2017',
                    is_deprecated: true
                },
                {
                    version: '0.5',
                    pub_datetime: 'February 20th, 2017',
                    is_deprecated: true
                }
            ],
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let deprecatedItems = [];
        return (
            <div className='CandyTreatDownloadBox'>
                <Card className='fullbleedcard'>
                    <CardTitle
                        title='Downloads'
                    />
                    <List style={{paddingBottom: '0px'}}>
                        <Divider />
                        {
                            this.state.versions.map((version, iter) => {
                                let listitem = (
                                        <ListItem
                                            rightIcon={<FileFileDownloadIcon />}
                                            primaryText={version.version}
                                            secondaryText={version.pub_datetime}
                                            onTouchTap={() => {console.log('download this plz');}}
                                            key={iter}
                                        />
                                );
                                if (!version.is_deprecated) {
                                    return listitem;
                                }
                                else {
                                    deprecatedItems.push(listitem);
                                }
                            })
                        }
                        <ListItem
                            primaryText="Older versions"
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={deprecatedItems}
                        />
                    </List>
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatDownloadBox);
