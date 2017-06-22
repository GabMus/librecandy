import React, { Component, Link } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FileFileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import CandyFetch from '../extjs/CandyFetch';
import ActionDeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';


class CandyTreatDownloadBox extends Component {
    constructor(props) {
        super(props);
        this.props=props;
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let deprecatedItems = [];
        let downloadsItems = null;
        let currentItems = []
        this.props.treat.details.map((version, iter) => {
            let deprecationCheckbox= this.props.edit ? (<Checkbox
                style={{
                    visibility: (this.props.edit) ? 'visible' : 'hidden'
                }}
                checked={version.is_deprecated}
                onCheck={(e, checked) => {
                    CandyFetch.putIt(
                        `${this.props.apiServer}/treats/${this.props.treat.package_name}/versions/${version.version}`,
                        `${this.props.userToken}`,
                        {
                            is_deprecated: checked
                        },
                        (data) => {
                            this.props.onVersionDeprecateToggle(data)
                        }
                    )
                }}
            />) : null;

            let dwIcon=this.props.edit ? null : <FileFileDownloadIcon />;
            let rmIcon=this.props.edit ? <IconButton
                    touch={true}
                    onTouchTap={() => {
                        CandyFetch.deleteIt(
                            `${this.props.apiServer}/treats/${this.props.treat.package_name}/versions/${version.version}`,
                            this.props.userToken,
                            (data) => {                                                            
                                this.props.onVersionDelete(data);
                            }
                        )
                    }}
                ><ActionDeleteForeverIcon /></IconButton> : null;

            let listitem = (
                    <ListItem
                        rightIcon={dwIcon}
                        rightIconButton={rmIcon}
                        leftCheckbox={deprecationCheckbox}
                        disabled={!!this.props.edit}
                        primaryText={version.version}
                        secondaryText={new Date(version.pub_datetime).toDateString()}
                        onTouchTap={() => {
                            window.location=version.file;
                        }}
                        key={iter}
                    />

            );
            if (!version.is_deprecated) {
                currentItems.push(listitem)
            }
            else {
                deprecatedItems.push(listitem);
            }
        }
        )


        let olderversions = null;
        if (deprecatedItems) {
            olderversions = <ListItem
                primaryText="Older versions"
                initiallyOpen={false}
                primaryTogglesNestedList={true}
                nestedItems={deprecatedItems}
            />}
        if (this.props.treat.details && this.props.treat.details.length > 0) {
            downloadsItems = (
                <List style={{paddingBottom: '0px'}}>
                    <Divider />
                    {currentItems}
                    {olderversions}
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
