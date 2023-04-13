
var strcTower = {
    run: function(tower) {
        if(tower) {
            //console.log(tower); // Gives me 2, correct
            //console.log(towers[tower].id); // Gives me 2, correct
            //console.log(tower); // Gives me 2, correct
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
};

module.exports = strcTower;