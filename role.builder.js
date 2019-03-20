var creepTransport = require('creep.transport');

var roleBuilder = {
    body: [WORK,CARRY,MOVE],

    /** @param {Creep} creep **/
    run: function(creep) {

      if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('transporting');
      } else if(!creep.memory.working && creep.carry.energy > 0) {
          creep.memory.working = true;
          creep.say('building');
      }

      if(creep.memory.working) {
          var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#0000FF' } });
                }
            }
      }
      else {
          creepTransport.run(creep, creep => creep.memory.role == "miner" && creep.memory.atPosition)
      }
  }
};

module.exports = roleBuilder;
