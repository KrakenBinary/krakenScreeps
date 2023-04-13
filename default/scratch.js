


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
var handbook = require('util.handbook');
var jobpostings = require('util.jobpostings');
const strcTower = require('./strc.tower');

module.exports.loop = function () {


    // console.log("Spawn: e." + Game.spawns["West Adams"].energy + " | c." + Game.spawns["West Adams"].energyCapacity)
    var energyCapacity = 0;
    energyCapacity += Game.spawns["West Adams"].energyCapacity;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
        energyCapacity += structure.energyCapacity;
    }
    });
    var energyAvailible = 0;
    energyAvailible += Game.spawns["West Adams"].energy;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
        energyAvailible += structure.energy;
    }
    });
    var HRsourceList;
    var currentSpawn = "";
    for(var rName in Game.rooms) {
        for(var sName in Game.rooms[rName].find(FIND_MY_SPAWNS)){
            currentSpawn = Game.rooms[rName].find(FIND_MY_SPAWNS)[sName].name;
            //console.log(currentSpawn);
        }
    }
    
    // Shows energy available to Spawn1 plus extensions
    //console.log('Available:', energyAvailible);
    //console.log('Capacity:', energyCapacity);
    //preController;
    
    var conCount = _.sum(Game.creeps, (c) => c.memory.role == 'consultant');
    var hrCount = _.sum(Game.creeps, (c) => c.memory.role == 'hr');
    var dbaCount = _.sum(Game.creeps, (c) => c.memory.role == 'dba');
    var devCount = _.sum(Game.creeps, (c) => c.memory.role == 'dev');
    var pmCount = _.sum(Game.creeps, (c) => c.memory.role == 'pm');
    var accountantCount = _.sum(Game.creeps, (c) => c.memory.role == 'accountant');
    var janitorCount = _.sum(Game.creeps, (c) => c.memory.role == 'janitor');

    
    console.log(currentSpawn);
    var towers = Game.rooms[currentSpawn].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for (var tower in towers){
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

    // HR Department
    
    //Always drop an HR. Just one
    var hrRoster = _(Game.creeps).filter({ memory: { role: 'hr' }}).value();
    var hrFTE = 1;
    if ( hrRoster.length < 1 ) {
        // Job: monitor the room and request new hires!
        // Side Job: move energy from containers to extensions && storage
        // cost: 100 body:[CARRY,MOVE]
        //console.log("-= HIT HR for: " + currentSpawn + " =-")
        var employeeID = "HR";
        var baseParts = [];
        var baseAddParts = [CARRY,MOVE];
        var finalParts = jobpostings.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        console.log("Job posting: [HR] " + employeeID + " | " + currentSpawn + " | " + finalParts);
        console.log(currentSpawn);
        Game.spawns[currentSpawn].createCreep(finalParts, (employeeID), {role: "hr"});
        /*
        if(energyAvailible >= 700){
            var hrCreep = Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY], (employeeID), {role: "hr", copyOnDeath: false});
        }
        else if(energyAvailible >= 600){
            var hrCreep = Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], (employeeID), {role: "hr", copyOnDeath: false});
        }
        else if(energyAvailible >= 500){
            var hrCreep = Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY], (employeeID), {role: "hr", copyOnDeath: false});
        }
        else if(energyAvailible >= 400){
            var hrCreep = Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,MOVE,CARRY,CARRY], (employeeID), {role: "hr", copyOnDeath: false});
        }
        else if(energyAvailible >= 300){
            var hrCreep = Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,CARRY], (employeeID), {role: "hr", copyOnDeath: false});
        }
        else if(_.isString(hrCreep)){ //Check if creation is succes -> succes = noString/Object, error = String
            console.log("hr role filled by: " + hrCreep); //logs name of creep
        } */
    }
    // If we dont have energy stores we need to use consultants.
    var consultantRoster = _(Game.creeps).filter({ memory: { role: 'consultant' }}).value();
    var consultantsFTE = 6;
    var energyThreshold = 500;
    //console.log("energy check1: " + energyCapacity);
    //console.log("energy check2: " + energyAvailible);
    if (energyCapacity < energyThreshold){
        if(consultantRoster.length < consultantsFTE){
            var employeeID = "C" + Math.floor(Math.random() * consultantsFTE);
            console.log("Job posting up for base consultant: " + consultantRoster.length + " | " + consultantsFTE + " | " + employeeID);
            if(energyAvailible >= 400){
                Game.spawns["West Adams"].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], (employeeID), {role: "consultant"});
            }
            else if(energyAvailible >= 300){
                Game.spawns["West Adams"].createCreep([WORK,WORK,CARRY,MOVE], (employeeID), {role: "consultant"});
            }
        }
    }
    // Lets say we have over energy threshold.
    else if (energyCapacity >= energyThreshold) {
        if(HRsourceList){// Drop one harvester per node.
            if(HRsourceList.length > dbaCount){
                console.log("Job posting up for base dba: ");
                for(var eSource in HRsourceList){
                    var employeeID = "D" + eSource;
                    var workLoc =  HRsourceList[eSource].id;
                    //move=50; work=100; carry=50
                    if(energyAvailible >= 800){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 700){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 600){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 500){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 400){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 300 && pmCount < 2){
                        Game.spawns["West Adams"].createCreep([WORK,WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                    else if(energyAvailible >= 200 && pmCount < 1){
                        Game.spawns["West Adams"].createCreep([WORK,MOVE,CARRY], (employeeID), {role: "dba", harvestingNode: workLoc});
                    }
                }
            }
            else if((HRsourceList.length*2) > pmCount){
                var rID = Math.floor(Math.random() * (HRsourceList.length*2))
                var employeeID = "P" + rID;
                console.log("Job posting up for base pm: ");
                //move=50; work=100; carry=50
                if(energyAvailible >= 800){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 700){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 600 && pmCount < 4){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 500 && pmCount < 3){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 400 && pmCount < 2){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 300 && pmCount < 1){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], (employeeID), {role: "pm"});
                }
                else if(energyAvailible >= 200 && pmCount < 1){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,MOVE], (employeeID), {role: "pm"});
                }
            }
            else if((HRsourceList.length) > accountantCount){
                var rID = Math.floor(Math.random() * (HRsourceList.length))
                var employeeID = "A" + rID;
                console.log("Job posting up for base accountant: ");
                //move=50; work=100; carry=50
                if(energyAvailible >= 800){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 700){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 600 && accountantCount < 4){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 500 && accountantCount < 3){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 400 && accountantCount < 2){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 300 && accountantCount < 1){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], (employeeID), {role: "accountant"});
                }
                else if(energyAvailible >= 200 && accountantCount < 1){
                    Game.spawns["West Adams"].createCreep([WORK,CARRY,MOVE], (employeeID), {role: "accountant"});
                }
            }
            else if((HRsourceList.length) > devCount){
                var rID = Math.floor(Math.random() * (HRsourceList.length))
                var employeeID = "E" + rID;
                console.log("Job posting up for base dev: ");
                //move=50; work=100; carry=50
                if(energyAvailible >= 800){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
                else if(energyAvailible >= 700){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
                else if(energyAvailible >= 600 && devCount < 4){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
                else if(energyAvailible >= 500 && devCount < 3){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
                else if(energyAvailible >= 400 && devCount < 2){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
                else if(energyAvailible >= 300 && devCount < 1){
                    Game.spawns["West Adams"].createCreep([WORK,WORK,CARRY,MOVE], (employeeID), {role: "dev", devNumber: rID});
                }
            }
            else if((HRsourceList.length) > janitorCount){
                var janitorID = Math.floor(Math.random() * (HRsourceList.length))
                var employeeID = "J" + janitorID;
                console.log("Job posting up for base dev: ");
                //move=50; work=100; carry=50
                if(energyAvailible >= 800 && janitorCount < 4){
                    Game.spawns["West Adams"].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "janitor"});
                }
                else if(energyAvailible >= 700 && janitorCount < 3){
                    Game.spawns["West Adams"].createCreep([TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], (employeeID), {role: "janitor"});
                }
                else if(energyAvailible >= 600 && janitorCount < 2){
                    Game.spawns["West Adams"].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], (employeeID), {role: "janitor"});
                }
                else if(energyAvailible >= 500 && janitorCount < 1){
                    Game.spawns["West Adams"].createCreep([TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], (employeeID), {role: "janitor"});
                }
            }
        }

    }
}