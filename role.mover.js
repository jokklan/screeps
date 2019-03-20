var creepTransport = require('creep.transport');

var roleMover = {
    body: [MOVE,MOVE],

    /** @param {Creep} creep **/
    run: function(creep) {
        const filter = creep => creep.memory.role == "miner" && !creep.memory.atPosition && creep.getActiveBodyparts(MOVE) == 0;
        
         if(creep.memory.working) {
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: filter
            });
            
            if (target) {
                creep.pull(target);
                
                if(creep.pos.isEqualTo(target.memory.destination.x, target.memory.destination.y)) {
                    if (target.move(creep) == OK && creep.move(target) == OK) {
                        creep.say('at position');
                        creep.memory.working = false;
                        target.memory.atPosition = true;
                    }
                } else {
                    target.move(creep);
                    creep.moveTo(target.memory.destination.x, target.memory.destination.y, { visualizePathStyle: {} });
                }
            }
        } else if(creepTransport.run(creep, filter)) {
            creep.say('pulling');
            creep.memory.working = true;
        }
  }
};

module.exports = roleMover;
