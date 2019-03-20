var creepTransport = require('creep.transport');

var roleUpgrader = {
    body: [WORK,CARRY,MOVE],

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('transporting');
        } else if(!creep.memory.working && creep.carry.energy > 0) {
            creep.memory.working = true;
            creep.say('upgrading');
        }
    
        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#FFFF00' } });
            }
        }
        else {
            creepTransport.run(creep, creep => creep.memory.role == "miner" && creep.memory.atPosition)
        }
  }
};

module.exports = roleUpgrader;
