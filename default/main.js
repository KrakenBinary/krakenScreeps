//var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');
var roleConsultant = require('role.consultant');
var roleHr = require('role.hr');
var roleDBA = require('role.dba');
var roleDev = require('role.dev');
var rolePM = require('role.pm');
var roleAccountant = require('role.accountant');
var roleJanitor = require('role.janitor');
//var handbook = require('util.handbook');
var jobpostings = require('util.jobpostings');
var strcTower = require('strc.tower');

module.exports.loop = function () {
    /*
    for(var name in Game.rooms) {
        console.log(name);
        var MeinRoom = Game.rooms[name];
        console.log(MeinRoom);
    }
    for (i = 0; i < spawns.length; i++) {
        var name = spawns[i];
        console.log(name);
        //Spawner.run(name, MeinRoom);
    }
    */
    for(var rName in Game.rooms) {
        //console.log("--="+rName);
        // For each room run following logic:
        var myRoom = Game.rooms[rName];
        //console.log("---="+myRoom);
        /*for(var sName in Game.rooms[rName].find(FIND_MY_SPAWNS)){
            var currentSpawn = Game.rooms[rName].find(FIND_MY_SPAWNS)[sName].name;
        }*/
        var currentSpawn = null;
        if(myRoom){
            currentSpawn = myRoom.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
        }
        //console.log(rName);
        var towers = Game.rooms[rName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for (var tower in towers){
            tower = Game.getObjectById(towers[tower].id);
            strcTower.run(tower);
        }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'consultant') {
                roleConsultant.run(creep);
            }
            if(creep.memory.role == 'hr') {
                roleHr.run(creep);
                HRsourceList = creep.memory.energySourcesList;
            }
            if(creep.memory.role == 'dba') {
                roleDBA.run(creep);
            }
            if(creep.memory.role == 'dev') {
                roleDev.run(creep);
            }
            if(creep.memory.role == 'pm') {
                rolePM.run(creep);
            }
            if(creep.memory.role == 'accountant') {
                roleAccountant.run(creep);
            }
            if(creep.memory.role == 'janitor') {
                roleJanitor.run(creep);
            }
        }
        // Need to refactor to account for multiple rooms.
        var hrRoster = _(Game.creeps).filter({ memory: { role: 'hr' }}).value();
        //console.log(hrRoster.length < 1 && currentSpawn != null);
        //var hrFTE = 1;
        if ( hrRoster.length < 1 && currentSpawn != null) {
            //console.log(currentSpawn);
            var employeeID = "HR";
            var baseParts = [CARRY,MOVE,WORK];
            var baseAddParts = [CARRY,MOVE];
            var finalParts = jobpostings.bodyBuild(currentSpawn[0].name, baseParts, baseAddParts, 0);
            //console.log(finalParts);
            if(finalParts){
                console.log("Job posting: [HR]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
                Game.spawns[currentSpawn[0].name].createCreep(finalParts, (employeeID), {role: "hr"});
            }
            else{
                console.log("Cannot hire [HR]");
            }
        }
    }
}