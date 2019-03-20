var creepTransport = require('creep.transport');

var roleHarvester = {
    body: [CARRY, CARRY,MOVE],

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('transporting');
      } else if(!creep.memory.working && creep.carry.energy > 0) {
          creep.memory.working = true;
          creep.say('harvesting');
      }

      if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#00FF00' } });
                }
            }
      }
      else {
          creepTransport.run(creep, creep => creep.memory.role == "miner" && creep.memory.atPosition)
      }
  }
};

module.exports = roleHarvester;
