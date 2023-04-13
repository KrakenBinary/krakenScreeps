//var handbook = require('util.handbook');
var roleJanitor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = "W9N2";     
        //var customerTargets = creep.room.find(Game.HOSTILE_CREEPS);
        var customerTargets = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        var structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || 
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_SPAWN);
            }
        });
        var endStructures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });
        //console.log("--==:" + customerTargets + " | " + towers + " | " + structures);
        
        
        if(towers != null && towers.length > 0){
            creep.moveTo(towers[0]);
            creep.attack(towers[0]);
        }
        else if(customerTargets != null) {
            //console.log(creep + " trying to attack " + customerTargets);
            creep.moveTo(customerTargets);
            creep.attack(customerTargets);
        }
        else if(structures != null && structures.length > 0){
            creep.moveTo(structures[0]);
            creep.attack(structures[0]);
        }
        else{
            //console.log(creep.pos);
            if (creep.room.name != target) { 
                //console.log(creep.room.name != target);
                //console.log(":::" + creep.room.name +" | "+ target);
                const exitDir = creep.room.findExitTo(target, [target]);
                const exit = creep.pos.findClosestByRange(exitDir);
                //console.log(creep + " trying to leave " + target);
                creep.moveTo(exit);
            }
            else{
                //console.log("NOTHING");
                //creep.moveTo(endStructures[0]);
                creep.moveTo(40,40);
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                    //console.log("Too Tired");
                }
            }
        }
    }
};

module.exports = roleJanitor;