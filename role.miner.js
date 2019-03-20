const transporterRoles = ['harvester', 'builder', 'upgrader'];

var roleMiner = {
    body: [WORK,WORK,CARRY,CARRY],

    /** @param {Creep} creep **/
    run: function(creep, position) {
        creep.memory.destination = position;
        
        if (!creep.memory.atPosition && creep.pos.isEqualTo(position.x, position.y)) {
            creep.memory.atPosition = true;
        }
        
        if (creep.memory.atPosition) {
            if(!creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = true;
                creep.say('mining');
            }
            
            if(creep.memory.working && creep.carry.energy == creep.carryCapacity) {
                creep.say('filled');
                creep.memory.working = false;
            }
        } else if(creep.memory.working) {
            creep.memory.working = false;
        }
    
        
        if (!creep.memory.atPosition && creep.getActiveBodyparts(MOVE) > 0) {
            creep.moveTo(position.x, position.y, { visualizePathStyle: { stroke: '#FF0000' } });
            
            return;
        }
        
        if (creep.memory.working) {
            const sources = creep.pos.findInRange(FIND_SOURCES, 1);
            const source = sources[0];
            
            if (source) {
                creep.harvest(source);
            } else {
                creep.memory.working = false;
            }
        } else {
            var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: creep => transporterRoles.includes(creep.memory.role)
            });
            
            var target = targets[0];
            
            if(target) {
                creep.say('transfering');
                creep.transfer(target, RESOURCE_ENERGY);
                creep.memory.working = true;
            }
        } 
  }
};

module.exports = roleMiner;
