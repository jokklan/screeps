roleNames = ['harvester', 'upgrader', 'builder', 'miner', 'mover', 'basicHarvester'];
var requiredCreepRoles = {};
var positions = {};
var roles = {};
for(var i = 0; i < roleNames.length; i++) {
    var roleName = roleNames[i];
    roles[roleName] = require('role.' + roleName);
    requiredCreepRoles[roleName] = 0;
}

customActions = {
    informationReports: require('action.information_reports'),
    sourceDelegator: require('action.source_delegator')
}

positions['miner'] = customActions.sourceDelegator.delegate();

const rolePriority = {
    mover: 1,
    miner: 2, 
    harvester: 3, 
    builder: 10, 
    upgrader: 100
}
requiredCreepRoles['harvester'] = 4
requiredCreepRoles['upgrader'] = 1
requiredCreepRoles['builder'] = 2
requiredCreepRoles['miner'] = positions['miner'].length
requiredCreepRoles['mover'] = 1
requiredCreepRoles['basicHarvester'] = 0


var update = true;
var currentCreepRoles = customActions.informationReports.currentRoles();

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    if(update) {
        var delegatedGreepRoles = {};
        var currentCreepRoles = customActions.informationReports.currentRoles();
        var extraCreeps = [];
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var position;
        
        if(positions[role]) {
            delegatedCount = delegatedGreepRoles[role] || 0;
            delegatedGreepRoles[role] = delegatedCount + 1;
            
            position = positions[role][delegatedCount]
        }

        if(update && currentCreepRoles[role] > requiredCreepRoles[role] || !roles[role]) {
            extraCreeps.push(creep);
        }
        
        if (role && roles[role]) {
            roles[role].run(creep, position);
            new RoomVisual().text(role.slice(0, 2).toUpperCase(), creep.pos.x, creep.pos.y, {color: '#ADD8E6', stroke: 'black', font: 0.7});
        } else {
            new RoomVisual().text('IDLE', creep.pos.x, creep.pos.y, {color: 'red', font: 1});
        }
    }

    if(update) {
        Object.entries(requiredCreepRoles)
            .sort(([aRole, aCount], [bRole, bCount]) => (
                rolePriority[aRole] - rolePriority[bRole] || (requiredCreepRoles[bRole] - currentCreepRoles[bRole]) - (requiredCreepRoles[aRole] - currentCreepRoles[aRole])
            ))
            .forEach(([role, count], index) => {
                if(count > currentCreepRoles[role]) {
                    if(extraCreeps.length > 0) {
                        var creep = extraCreeps.pop();
                        console.log('Changing role of ' + creep.name + ' from ' + creep.memory.role + ' to ' + role);
                        creep.memory.role = role;
                    } else {
                        var newName = Game.spawns['Spawn1'].createCreep(roles[role].body, undefined, {role: role});
                        
                        if (newName !== ERR_NOT_ENOUGH_ENERGY && newName !== ERR_BUSY) {
                            console.log('Spawning new ' + role + ': ' + newName);
                        } else {
                            console.log('Not enough energy: ' + role);
                        }
                    }
                }
            });
        
        if (extraCreeps.length > 0) {
            console.log('Extra creeps: ' + extraCreeps.length + ' (' + extraCreeps.map(creep => creep.memory.role) + ')');
        }
    }
}
