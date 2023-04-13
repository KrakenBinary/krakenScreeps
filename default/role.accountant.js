/*
 * The Dev role is to build build build.
 */

var handbook = require('util.handbook');
var roleAccountant = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var containerTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        var storeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.memory.storing = false;
            creep.memory.upgrading = false;
            handbook.containersMostEnergy(creep, containerTargets);
            creep.say('⛏️');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.memory.storing = true;
            creep.memory.upgrading = false;
            creep.say('🎒');
        }
        if(creep.memory.storing && storeTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.storing = false;
            creep.memory.upgrading = true;
            creep.say('🪙');
        }

	    if(creep.memory.harvesting) {handbook.workflowHarvest(creep, containerTargets);}
        if(creep.memory.storing) {handbook.workflowStore(creep, storeTargets);}
        if(creep.memory.upgrading) {handbook.workflowUpgrade(creep);}
	}
};

module.exports = roleAccountant;