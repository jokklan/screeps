var creepTransport = {

    /** @param {Creep} creep **/
    run: function(creep, filterFunction) {
        var targets = creep.room.find(FIND_MY_CREEPS, {
            filter: creep => filterFunction(creep)
        });
        targets.sort((a,b) => {
            const energyDiff = b.carry.energy - a.carry.energy;
            pathDiff = 0;
            //const pathDiff = creep.pos.findPathTo(a).length - creep.pos.findPathTo(b).length;
            return energyDiff + pathDiff;
        });
        let target = targets[0];
        
        if (!target) {
            target = creep.room.find(FIND_MY_SPAWNS)[0];
        }
        
        let path = creep.pos.findPathTo(target);
        if(path.length > 1) {
            creep.move(path[0].direction);
            new RoomVisual().poly(path.map(p => [p.x, p.y]), {
                fill: 'transparent',
                stroke: '#fff',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .1
            })
            return false;
        } else if (target) {
            target.memory.working = false;
            return true;
        }
  }
};

module.exports = creepTransport;