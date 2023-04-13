/*
 * The Dev role is to build build build.
 */

var handbook = require('util.handbook');
var roleDev = {

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
        //repair targets
        var repairTargets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        //repairTargets.sort((a,b) => a.hits - b.hits); //not sorting for now.
        //construction targets
        var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.memory.building = false;
            creep.memory.repair = false;
            creep.memory.upgrading = false;
            handbook.containersMostEnergy(creep, containerTargets);
            creep.say('⛏️');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.memory.building = true;
            creep.memory.repair = false;
            creep.memory.upgrading = false;
            creep.say('🏗️');
        }
        if(creep.memory.building && constructionTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.building = false;
            creep.memory.repair = true;
            creep.memory.upgrading = false;
            creep.say('🛠️');
        }
        if(creep.memory.repair && repairTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.building = false;
            creep.memory.repair = false;
            creep.memory.upgrading = true;
            creep.say('🪙');
        }
	    if(creep.memory.harvesting) {handbook.workflowHarvest(creep, containerTargets);}
        if(creep.memory.building) {handbook.workflowBuild(creep, constructionTargets);}
        if(creep.memory.repair) {handbook.workflowRepair(creep, repairTargets);}
        if(creep.memory.upgrading) {handbook.workflowUpgrade(creep);}
	}
};

module.exports = roleDev;