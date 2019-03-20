var actionInformationReports = {
    print: function(report) {
        for(var i in report) {
            console.log(i + ': ' + report[i]);
        }
    },
    currentRoles: function() {
        currentCreepRoles = {};
        for(var i = 0; i < roleNames.length; i++) {
            currentCreepRoles[roleNames[i]] = 0;
        }

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var role = creep.memory.role;
            currentCreepRoles[role] || (currentCreepRoles[role] = 0);
            currentCreepRoles[role] += 1;
        }

        return currentCreepRoles;
    }
}
module.exports = actionInformationReports;
