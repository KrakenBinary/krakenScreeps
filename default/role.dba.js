/*
 * DBA role is to harvest energy and store it
 */

var roleDBA = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var storingTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (!creep.memory.harvestingNode && creep.memory.harvestingNode != 0 ){
            creep.say('HR help?');
        }
        if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.storing = false;
            creep.memory.harvesting = true;
            //creep.say('⛏️');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.storing = true;
            creep.memory.harvesting = false;
            //creep.say('🎒');
        }

	    if(creep.memory.harvesting) {
            if(creep.harvest(Game.getObjectById(creep.memory.harvestingNode)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.harvestingNode), {visualizePathStyle: {stroke: '#ff0066'}});
            }
        }
        else if (creep.memory.storing){
            if(storingTargets.length > 0) {
                if(creep.transfer(storingTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.say("HELP!"); //WE DONT WANT THIS GUY MOVING!
                }
            }
        }
	}
};

module.exports = roleDBA;