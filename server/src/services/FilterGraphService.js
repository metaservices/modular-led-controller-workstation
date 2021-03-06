import { func } from "prop-types";

const FilterGraphService = {
    getAllConnections: function(slotId) {
        return fetch('./slot/' + slotId + '/connections').then(res => res.json())
    },
    addConnection: function (slotId, from_node_uid, from_node_channel, to_node_uid, to_node_channel, modulationUid) {
        var postData = { from_node_uid: from_node_uid, from_node_channel: from_node_channel, to_node_uid: to_node_uid, to_node_channel: to_node_channel };

        // Save node in backend
        return fetch('./slot/' + slotId + '/connection', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(postData), // modulationUid can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            throw error
        }).then(res => res.json()
        ).then(connection => {
            console.debug('Create connection successful:', modulationUid);
            return connection
        }).catch(error => {
            console.error('Error on creating connection:', error);
            throw error
        });
    },
    deleteConnection: function (slotId, id) {
        return fetch('./slot/' + slotId + '/connection/' + id, {
            method: 'DELETE'
        }).then(res => {
            console.debug('Delete connection successful:', id);
        }).catch(error => {
            console.error('Error on deleting connection:', error)
        })
    },
    getAllNodes: function(slotId) {
        return fetch('./slot/' + slotId + '/nodes').then(res => res.json());
    },
    getNode: function(slotId, id) {
        return fetch('./slot/' + slotId + '/node/' + id).then(res => res.json())
    },
    getNodeParameterDefinition: function(slotId, id) {
        return fetch('./slot/' + slotId + '/node/' + id + '/parameterDefinition').then(res => res.json());
    },
    getNodeModulateableParameters: function(slotId, id) {
        return fetch('./slot/' + slotId + '/node/' + id + '/modulateableParameters').then(res => res.json());
    },
    getNodeEffect: function(slotId, id) {
        return fetch('./slot/' + slotId + '/node/' + id + '/effect').then(res => res.json());
    },
    addNode: function(slotId, selectedEffect, options) {
        return fetch('./slot/' + slotId + '/node', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify([selectedEffect, options]), // modulationUid can be `string` or {object}!
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
    },
    updateNode: function(slotId, modulationUid, options, abortSignal = null) {
        return fetch('./slot/' + slotId + '/node/' + modulationUid, {
            method: 'PUT', 
            body: JSON.stringify(options), // modulationUid can be `string` or {object}!
            headers: {
              'Content-Type': 'application/json'
            },
            signal: abortSignal
          }).then(res => res.json())
    },
    deleteNode: function (slotId, id) {
        return fetch('./slot/' + slotId + '/node/' + id, {
            method: 'DELETE'
        }).then(res => {
            console.debug('Delete node successful:', id);
        }).catch(error => {
            console.error('Error on deleting node:', error)
        })
    },
    getAllModulationSources: function(slotId) {
        return fetch('./slot/' + slotId + '/modulationSources').then(res => res.json());
    },
    getModulationSource: function(slotId, modulationUid) {
        return fetch('./slot/' + slotId + '/modulationSource/' + modulationUid).then(res => res.json());
    },
    updateModulationSource: function(slotId, modulationUid, options, abortSignal = null) {
        return fetch('./slot/' + slotId + '/modulationSource/' + modulationUid, {
            method: 'PUT', 
            body: JSON.stringify(options), // modulationUid can be `string` or {object}!
            headers: {
              'Content-Type': 'application/json'
            },
            signal: abortSignal
          }).then(res => res.json())
    },
    deleteModulationSource: function(slotId, id) {
        return fetch('./slot/' + slotId + '/modulationSource/' + id, {
            method: 'DELETE'
        }).then(res => {
            console.debug('Delete modulation source successful:', id);
        }).catch(error => {
            console.error('Error on deleting modulation source:', error)
        })
    },
    getAllModulations: function(slotId, modulationSourceUid = null, modulationDestinationUid = null) {
        var url = './slot/' + slotId + '/modulations'
        var params = {}
        if(modulationSourceUid != null) {
            params['modulationSourceUid'] = modulationSourceUid
        }
        if(modulationDestinationUid != null) {
            params['modulationDestinationUid'] = modulationDestinationUid
        }
        if(Object.keys(params).length > 0) {
            var urlParams = new URLSearchParams(params)
            return fetch(`${url}?${urlParams.toString()}`).then(res => res.json());
        } else {
            return fetch(url).then(res => res.json());
        }
    },
    getModulation: function(slotId, modulationUid) {
        return fetch('./slot/' + slotId + '/modulation/' + modulationUid).then(res => res.json());
    },
    addModulation: function(slotId, modulationSourceUid, targetNodeUid) {
        var postData = {modulationsource_uid: modulationSourceUid, target_uid: targetNodeUid};
        return fetch('/slot/' + slotId + '/modulation', {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            throw error
        }).then(res => res.json()
        ).then(connection => {
            console.debug('Create connection successful:', connection);
            return connection
        }).catch(error => {
            console.error('Error on creating connection:', error);
            throw error
        });
    },
    updateModulation: function(slotId, modulationUid, options, abortSignal = null) {
        return fetch('./slot/' + slotId + '/modulation/' + modulationUid, {
            method: 'PUT', 
            body: JSON.stringify(options), // modulationUid can be `string` or {object}!
            headers: {
              'Content-Type': 'application/json'
            },
            signal: abortSignal
          }).then(res => res.json())
    },
    deleteModulation: function(slotId, id) {
      return fetch('./slot/' + slotId + '/modulation/' + id, {
          method: 'DELETE'
      }).then(res => {
        console.debug('Delete modulation successful:', id);
    }).catch(error => {
        console.error('Error on deleting modulation:', error)
    })
    },
    getAllEffects: function(abortSignal = null) {
        return fetch('./effects', {signal: abortSignal}).then(res => res.json());
    },
    getEffectDescription: function(selectedEffect) {
        return fetch('./effect/' + selectedEffect + '/description').then(res => res.text());
    },
    getEffectParameters: function(selectedEffect) {
        return fetch('./effect/' + selectedEffect + '/parameter').then(res => res.json());
    },
    getEffectArguments: function(selectedEffect) {
        return fetch('./effect/' + selectedEffect + '/args').then(res => res.json());
    },
    getEffectParameterHelp: function(selectedEffect) {
        return fetch('./effect/' + selectedEffect + '/parameterHelp').then(res => res.json());
    },
    activateScene: function(slot) {
        var postData = {slot: slot}
        return fetch('./project/activeScene', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    getActiveScene: function() {
        return fetch('./project/activeScene').then(res => res.json())
    },
    updateSceneMatrix: function(sceneMatrix) {
        var postData = sceneMatrix
        return fetch('./project/sceneMatrix', {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    getSceneMatrix: function() {
        return fetch('./project/sceneMatrix').then(res => res.json())
    },
    activateSlot: function(slot) {
        var postData = {slot: slot}
        return fetch('./project/activateSlot', {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export default FilterGraphService;
