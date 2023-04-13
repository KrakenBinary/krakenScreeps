/*
 * HR repairs things and keeps track of the room
 */

var handbook = require('util.handbook');
var jobpostings = require('util.jobpostings');
var roleConsultant = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //Find all the targets for various things:
        //containers targets
        var containerTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        //repairTargets.sort((a,b) => a.hits - b.hits); //not sorting for now.
        //store targets
        var storeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ( structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        //construction targets
        var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.memory.storing = false;
            creep.memory.building = false;
            creep.memory.upgrading = false;
            handbook.containersMostEnergy(creep, containerTargets);
            creep.say('⛏️');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.memory.storing = true;
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.say('🎒');
        }
        if(creep.memory.storing && storeTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.storing = false;
            creep.memory.building = true;
            creep.memory.upgrading = false;
            creep.say('🏗️');
        }
        if(creep.memory.building && constructionTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.storing = false;
            creep.memory.building = false;
            creep.memory.upgrading = true;
            creep.say('🪙');
        }
        
	    if(creep.memory.harvesting) {handbook.workflowHarvest(creep, containerTargets);}
        if(creep.memory.storing) {handbook.workflowStore(creep, storeTargets);}
        if(creep.memory.building) {handbook.workflowBuild(creep, constructionTargets);}
        if(creep.memory.upgrading) {handbook.workflowUpgrade(creep);}
	}
};

module.exports = roleConsultant;