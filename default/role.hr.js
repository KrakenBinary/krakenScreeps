/*
 * HR repairs things and keeps track of the room
 */

var handbook = require('util.handbook');
var jobpostings = require('util.jobpostings');
var roleHr = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //Find all the targets for various things:
        //energy sources
        var sources = creep.room.find(FIND_SOURCES);
        //containers targets
        var containerTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || 
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        //repair targets
        var repairTargets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        //repairTargets.sort((a,b) => a.hits - b.hits); //not sorting for now.
        //store targets
        var storeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ( structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        //construction targets
        var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //HR needs to keep track of sources.
        if(!creep.memory.energySourcesList || sources.length != creep.memory.energySourcesList.length){
            creep.memory.energySourcesList = creep.room.find(FIND_SOURCES);
        }
        for(var rName in Game.rooms) {
            for(var sName in Game.rooms[rName].find(FIND_MY_SPAWNS)){
                jobpostings.getRoomHeadcount(Game.rooms[rName].find(FIND_MY_SPAWNS)[sName].name, creep.memory.energySourcesList.length, creep.memory.energySourcesList);
            }
        }

        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.memory.repair = false;
            creep.memory.storing = false;
            creep.memory.building = false;
            creep.memory.upgrading = false;
            handbook.containersMostEnergy(creep, containerTargets);
            creep.say('⛏️');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.memory.repair = true;
            creep.memory.storing = false;
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.say('🛠️');
        }
        if(creep.memory.repair && repairTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.repair = false;
            creep.memory.storing = true;
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.say('🎒');
        }
        if(creep.memory.storing && storeTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.repair = false;
            creep.memory.storing = false;
            creep.memory.building = true;
            creep.memory.upgrading = false;
            creep.say('🏗️');
        }
        if(creep.memory.building && constructionTargets.length == 0) {
            creep.memory.harvesting = false;
            creep.memory.repair = false;
            creep.memory.storing = false;
            creep.memory.building = false;
            creep.memory.upgrading = true;
            creep.say('🪙');
        }
        
	    if(creep.memory.harvesting) {handbook.workflowHarvest(creep, containerTargets);}
        if(creep.memory.repair) {handbook.workflowRepair(creep, repairTargets);}
        if(creep.memory.storing) {handbook.workflowStore(creep, storeTargets);}
        if(creep.memory.building) {handbook.workflowBuild(creep, constructionTargets);}
        if(creep.memory.upgrading) {handbook.workflowUpgrade(creep);}
	}
};

module.exports = roleHr;