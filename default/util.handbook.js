/*
* This employee handbook contains all things employees should be doing. Standard processes and workflows.
*/

var handbook = {

    hitMe: function(creep) {
        console.log("-= HIT =-" + creep);
        this.hitMe2();
        return "Crazy";
	},
    hitMe2: function() {
        console.log("-= HIT HIT =-")
	},
    containersMostEnergy: function(creep, containerTargets){
        // This function finds a container with the highest percent energy availible. You must pass a list of targets.
        //console.log("Finding the most energy!");
        if ( containerTargets.length ) {
            var allContainer = [];
            for ( var i = 0; i < containerTargets.length; i++ ) {
                allContainer.push( { energyPercent: ( ( containerTargets[i].store.energy / containerTargets[i].storeCapacity ) * 100 ), id: containerTargets[i].id } );
            }
            var highestContainer = _.max( allContainer, function( container ){ return container.energyPercent; });
            creep.memory.targetContainer = highestContainer.id;
        }
    },
    workflowHarvest: function(creep, containerTargets){
        if(Game.getObjectById(creep.memory.targetContainer) && Game.getObjectById(creep.memory.targetContainer).store.energy > 0){
            if(creep.withdraw(Game.getObjectById(creep.memory.targetContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){ 
                creep.moveTo(Game.getObjectById(creep.memory.targetContainer), {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        else{
            this.containersMostEnergy(creep, containerTargets);
        }
    },
    workflowBuild: function(creep, constructionTargets){
        if(constructionTargets.length > 0 && creep.build(constructionTargets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionTargets[0], {visualizePathStyle: {stroke: '#00ff00'}});
        }
    },
    workflowStore: function(creep, storeTargets){
        if(storeTargets.length > 0 && creep.transfer(storeTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storeTargets[0], {visualizePathStyle: {stroke: '#ff0066'}});
        }
    },
    workflowRepair: function(creep, repairTargets){
        if(repairTargets.length > 0 && creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#ff6666'}});
        }
    },
    workflowUpgrade: function(creep){
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0066ff'}});
        }
    }
};

module.exports = handbook;