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
            versions: props.versions,
        };
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let deprecatedItems = [];

        let downloadsItems = null;
        if (this.state.versions) {
            downloadsItems = (
                <List style={{paddingBottom: '0px'}}>
                    <Divider />
                    {
                        this.state.versions.map((version, iter) => {
                            let listitem = (
                                    <ListItem
                                        rightIcon={<FileFileDownloadIcon />}
                                        primaryText={version.version}
                                        secondaryText={new Date(version.pub_datetime).toDateString()}
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
                    {() => {
                        if (deprecatedItems) {
                            <ListItem
                                primaryText="Older versions"
                                initiallyOpen={false}
                                primaryTogglesNestedList={true}
                                nestedItems={deprecatedItems}
                            />}
                        }}
                </List>
            )
        }
        else {
            downloadsItems = (<h3 style={{textAlign: 'center', paddingBottom: '24px'}}>No versions available yet</h3>)
        }
        return (
            <div className='CandyTreatDownloadBox'>
                <Card className='fullbleedcard'>
                    <CardTitle
                        title='Downloads'
                    />
                    {downloadsItems}
                </Card>
            </div>
        );
    }
}

export default muiThemeable() (CandyTreatDownloadBox);
