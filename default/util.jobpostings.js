
var jobpostings = {

    getRoomHeadcount: function(currentSpawn, resourceCount, HRsourceList) {
        //console.log("-= HIT HeadCount for: " + currentSpawn + " =-");
        //var letsCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'pm'}});
        //console.log("-= " + letsCount + " =-");
        var aCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'accountant'}});
        var cCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'consultant'}});
        var dCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'dba'}});
        var eCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'dev'}});
        //var hCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'hr'}});
        var jCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'janitor'}});
        var pCount = Game.spawns[currentSpawn].room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == 'pm'}});
        /*
        console.log(
            "-= a:" + aCount.length + 
            " = c:" + cCount.length + 
            " = d:" + dCount.length + 
            " = e:" + eCount.length + 
            " = h:" + hCount.length + 
            " = j:" + jCount.length + 
            " = p:" + pCount.length + 
            " =-");
        */
        //console.log(resourceCount);

        //Start with a DBA and have them build their own containers first. Once containers are up hire more people.

        //console.log(hCount.length);
        //if(hCount.length<1){this.hireHR(currentSpawn, resourceCount)}//only one single HR per room
        //console.log("Spawn Check: " + currentSpawn.spawning.name);
        if(Game.spawns[currentSpawn].spawning) {
            console.log("Currently Spawning: " + Game.spawns[currentSpawn].spawning.name + " at " + currentSpawn);
        }
        else{
            if(dCount.length<resourceCount){this.hireDBA(currentSpawn, resourceCount, HRsourceList)}
            else if(aCount.length<resourceCount){this.hireAccountant(currentSpawn, resourceCount)}
            else if(cCount.length<resourceCount){this.hireConsultant(currentSpawn, resourceCount)}
            else if(eCount.length<resourceCount){this.hireDev(currentSpawn, resourceCount)}
            else if(pCount.length<resourceCount){this.hirePM(currentSpawn, resourceCount)}
            else if(jCount.length<resourceCount){this.hireJanitor(currentSpawn, resourceCount)}
            //else{console.log(" ");}
        }
	},
    /*
    hireHR: function(currentSpawn, resourceCount) {
        // Job: monitor the room and request new hires!
        // Side Job: move energy from containers to extensions && storage
        // cost: 100 body:[CARRY,MOVE]
        //console.log("-= HIT HR for: " + currentSpawn + " =-")
        var employeeID = "H" + Math.floor(Math.random() * resourceCount);
        var baseParts = [];
        var baseAddParts = [CARRY,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        console.log("Job posting: [HR] " + employeeID + " | " + currentSpawn + " | " + finalParts);
        Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "hr"});
	},
    */
    hireDBA: function(currentSpawn, resourceCount, HRsourceList) {
        // Job: Mine energy and place in containers
        // cost: 100 body:[WORK] baseCost:200 baseBody:[WORK,CARRY,MOVE]
        // Notes: 2e/tick/WORK and resources last 300 ticks at 3k energy so 10e/tick is needed or 5 WORK parts
        //console.log("-= HIT DBA for: " + currentSpawn + " =-")
        //var employeeID = this.getEmployeeID(resourceCount, "D");
        var baseParts = [CARRY,MOVE,WORK];
        var baseAddParts = [WORK];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 6);
        for(var eSource in HRsourceList){
            var workLoc =  HRsourceList[eSource].id;
            var employeeID = "D" + eSource;
            if(finalParts){
                console.log("Job posting: [DBA]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
                Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "dba", harvestingNode: workLoc});
            }
            else{
                console.log("Cannot hire [DBA]");
            }
        }
	},
    hireAccountant: function(currentSpawn, resourceCount) {
        // Job: take energy from containers and put it in extensions && storage
        //console.log("-= HIT Accountant for: " + currentSpawn + " =-")
        var employeeID = this.getEmployeeID(resourceCount, "A");
        var baseParts = [CARRY,MOVE];
        var baseAddParts = [CARRY,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        if(finalParts){
            console.log("Job posting: [Accountant]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
            Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "accountant"});
        }
        else{
            console.log("Cannot hire [Accountant]");
        }
	},
    hireConsultant: function(currentSpawn, resourceCount) {
        // Job: take energy from storage and upgrade room
        //console.log("-= HIT Consultant for: " + currentSpawn + " =-")
        var employeeID = this.getEmployeeID(resourceCount, "C");
        var baseParts = [CARRY,MOVE,WORK];
        var baseAddParts = [WORK,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        if(finalParts){
            console.log("Job posting: [Consultant]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
            Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "consultant"});
        }
        else{
            console.log("Cannot hire [Consultant]");
        }
	},
    hireDev: function(currentSpawn, resourceCount) {
        // Job: take energy from storage and build
        //console.log("-= HIT Dev for: " + currentSpawn + " =-")
        var employeeID = this.getEmployeeID(resourceCount, "E");
        var baseParts = [CARRY,MOVE,WORK];
        var baseAddParts = [CARRY,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        if(finalParts){
            console.log("Job posting: [Dev]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
            Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "dev"});
        }
        else{
            console.log("Cannot hire [Dev]");
        }
	},
    hireJanitor: function(currentSpawn, resourceCount) {
        // Job: ??
        //console.log("-= HIT Janitor for: " + currentSpawn + " =-")
        var employeeID = this.getEmployeeID(resourceCount*20, "J");
        var baseParts = [ATTACK,MOVE];
        var baseAddParts = [ATTACK,TOUGH,MOVE,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        if(finalParts){
            console.log("Job posting: [Janitor]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
            Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "janitor"});
        }
        else{
            console.log("Cannot hire [Janitor]");
        }
	},
    hirePM: function(currentSpawn, resourceCount) {
        // Job: take energy from storage and put in turrets
        //console.log("-= HIT PM for: " + currentSpawn + " =-")
        var employeeID = this.getEmployeeID(resourceCount, "P");
        var baseParts = [WORK,CARRY,MOVE];
        var baseAddParts = [WORK,CARRY,MOVE,MOVE];
        var finalParts = this.bodyBuild(currentSpawn, baseParts, baseAddParts, 0);
        if(finalParts){
            console.log("Job posting: [PM]: " + employeeID + " | " + currentSpawn + " | " + finalParts);
            Game.spawns[currentSpawn].createCreep(finalParts, employeeID, {role: "pm"});
        }
        else{
            console.log("Cannot hire [PM]");
        }
	},
    getEmployeeID: function(eCount, eLetter){
        var employeeID = eLetter + Math.floor(Math.random() * eCount);
        return employeeID;
    },
    bodyCost: function(body)
    {
        let sum = 0;
        for (let i in body)
            sum += BODYPART_COST[body[i]];
        return sum;
    },
    bodyBuild: function(currentSpawn, baseParts, baseAddParts, maxAdditions)
    {
        //console.log("--==: " + currentSpawn[0].name + " | " + baseParts + " | " + baseAddParts + " | " + maxAdditions);
        var baseCosts = this.bodyCost(baseParts);
        var baseAddCosts = this.bodyCost(baseAddParts);
        var totalBaseCosts = baseCosts + baseAddCosts;
        var energyAvailable = 0;
        var energyCapacityAvailable = 0;
        energyAvailable = Game.spawns[currentSpawn].room.energyAvailable;
        energyCapacityAvailable = Game.spawns[currentSpawn].room.energyCapacityAvailable;
        var minUsed = energyCapacityAvailable/2;
        //console.log("--==: " + baseCosts + " | " + baseAddCosts + " | " + totalBaseCosts + " | " + energyAvailable + " | " + energyCapacityAvailable + " | " + minUsed);
        if(minUsed<totalBaseCosts && totalBaseCosts<energyCapacityAvailable){
            minUsed = totalBaseCosts;
        }
        if(energyAvailable>=totalBaseCosts){
            var afterBase = energyAvailable - totalBaseCosts;
            var baseAfforded = Math.floor(afterBase/baseAddCosts/2);
            var buildParts = [];
            var i = 0;
            //console.log("--==: " + baseCosts + " | " + baseAddCosts + " | " + afterBase + " | " + energyAvailable + " | " + energyCapacityAvailable + " | " + minUsed);
            if(baseParts.length>0){
                buildParts.push(...baseParts);
            }
            if(maxAdditions == 0){
                maxAdditions = baseAfforded;
            }
            else if (maxAdditions > baseAfforded){
                maxAdditions = baseAfforded;
            }
            while (i < maxAdditions) {
                buildParts.push(...baseAddParts);
                i++;
            }
        }
        return buildParts;
    }
};

module.exports = jobpostings;