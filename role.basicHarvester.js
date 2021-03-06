var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.carry.energy < creep.carryCapacity) {
            if (!creep.memory.destinationId) {
                var sources = creep.room.find(FIND_SOURCES);
                creep.memory.destinationId = sources[Math.floor(Math.random() * sources.length)].id;
            }
            
            const source = Game.getObjectById(creep.memory.destinationId);
            
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: {} });
            }
        }
        else {
            creep.memory.destinationId = undefined;
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: {} });
                }
            }
        }
  }
};

module.exports = roleHarvester;
