import React from "react";
import PropTypes, { bool } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FilterGraphService from "../services/FilterGraphService";
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog, { WithMobileDialog } from '@material-ui/core/withMobileDialog';
import {makeCancelable} from '../util/MakeCancelable';

import './NodePopup.css'

import Configurator from './Configurator';

const styles = theme => ({
    paper: {
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: theme.spacing(80),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: 'none',
    },
});

class EditModulationSourcePopup extends React.Component {

    state = {
        config: null
    }

    componentDidMount() {
        this._loadAsyncData(this.props.slot, this.props.modulationUid)
    }

    componentDidUpdate() {
        if(this.config === null) {
            this._loadAsyncData(this.props.slot, this.props.modulationUid)
        }
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }

    _loadAsyncData(slot, uid) {
        this._asyncRequest = makeCancelable(FilterGraphService.getModulationSource(slot, uid))
        
        this._asyncRequest.promise.then(json => {
            var effectName = json['modulator']['py/object']
            var parameterDefinitionJson = FilterGraphService.getEffectParameters(effectName)
            return Promise.all([json, parameterDefinitionJson])
        }).then(result => {
            var modSource = result[0]
            console.log(modSource)
            var currentParameterValues = modSource['modulator']['py/state']
            var parameterDefinition = result[1]
            console.log(parameterDefinition)
            this._asyncRequest = null;
            this.setState(state => {
                return {
                    config: {
                        parameters: parameterDefinition.parameters,
                        values: currentParameterValues,
                        parameterHelp: null,
                        description: ""
                    }
                }
            })
        })

        // this._asyncRequest.promise.then(effectName => {
        //     const nodeJson = FilterGraphService.getNode(slot, uid);
        //     const parameterDefinitionJson = FilterGraphService.getNodeParameter(slot, uid);
        //     const helpJson = FilterGraphService.getEffectParameterHelp(effectName);
        //     const description = FilterGraphService.getEffectDescription(effectName);
        //     return Promise.all([nodeJson, parameterDefinitionJson, helpJson, description])
        // }).then(result => {
        //     var currentParameterValues = result[0]["py/state"]["effect"]["py/state"];
        //     var parameterDefinition = result[1];
        //     var helpText = result[2];
        //     var desc = result[3];
        //     this._asyncRequest = null;
        //     this.setState(state => {
        //         return {
        //             config: {
        //                 parameters: parameterDefinition.parameters,
        //                 values: currentParameterValues,
        //                 parameterHelp: (helpText !== null && helpText.parameters !== null) ? helpText.parameters : {},
        //                 description: desc
        //             }
        //         }
        //     })
        // })
    }

    

    handleNodeEditCancel = async (event) => {
        if (this.props.onCancel != null) {
            this.props.onCancel()
        }
    }

    sortSelect(selElem) {
        var tmpAry = new Array();
        for (var i = 0; i < selElem.options.length; i++) {
            tmpAry[i] = new Array();
            tmpAry[i][0] = selElem.options[i].text;
            tmpAry[i][1] = selElem.options[i].value;
        }
        tmpAry.sort();
        while (selElem.options.length > 0) {
            selElem.options[0] = null;
        }
        for (var i = 0; i < tmpAry.length; i++) {
            var op = new Option(tmpAry[i][0], tmpAry[i][1]);
            selElem.options[i] = op;
        }
        return;
    }

    handleParameterChange = (value, parameter) => {
        let newState = Object.assign({}, this.state);    //creating copy of object
        newState.config.values[parameter] = value;
        FilterGraphService.updateModulationSource(this.props.slot, this.props.modulationUid, { [parameter]: value })
        this.setState(newState);
    };

    domCreateDialogContent = (classes, effectDescription, parameters, values, parameterHelp) => {
        return <DialogContent>
        <div>
            {effectDescription.length > 0 ? 
            <React.Fragment>
            <br/>
            {effectDescription.split("\n").map((line, idx) => {
                return <Typography key={"line"+idx}>
                    {line}
                </Typography>
            })}
            </React.Fragment>
            : null}
        </div>
        <div id="node-grid">
            <h3>Parameters:</h3>
            <Configurator 
                onChange={(parameter, value) => this.handleParameterChange(value, parameter)}
                parameters={parameters}
                values={values}
                parameterHelp={parameterHelp}/>
        </div>
        <h3></h3>
        <Divider className={classes.divider} />
        <h3></h3>
        </DialogContent>
    }

    render() {
        const { classes } = this.props;
        var dialogContent = null
        if(this.state.config != null) {
            let parameters = this.state.config.parameters;
            let values = this.state.config.values;
            let parameterHelp = this.state.config.parameterHelp;
            let effectDescription = this.state.config.description;
            dialogContent = this.domCreateDialogContent(classes,effectDescription, parameters, values, parameterHelp)
        }
        return (
            
            <Dialog 
                open={this.props.open} 
                onClose={this.handleNodeEditCancel} 
                aria-labelledby="form-dialog-title"
                maxWidth="xl"
                fullWidth={true}
                fullScreen={this.props.fullScreen}
            >
                <DialogTitle id="form-dialog-title">Edit Modulation Source</DialogTitle>
                {dialogContent}
                <DialogActions>
                <Button onClick={this.handleNodeEditCancel} color="primary" variant="contained" >
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

EditModulationSourcePopup.propTypes = {
    classes: PropTypes.object.isRequired,
    slot: PropTypes.number.isRequired,
    modulationUid: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired
};

export default withStyles(styles)(withMobileDialog()(EditModulationSourcePopup));