const rolePriority = {
    miner: 1,
    transporter: 1.5,
    builder: 2,
    upgrader: 2
}
var roleDelegator = {
    delegate: function() {
        let result = [];
        
        const rooms = Game.rooms;
        Object.values(Game.rooms).forEach(room => {
            const terrain = room.getTerrain();
            const sources = room.find(FIND_SOURCES);
            
            sources.forEach(source => {
                const { x, y } = source.pos;
                let positions = room.lookAtArea(y - 1, x - 1, y + 1, x + 1, true);
                
                const freePositions = _.filter(positions, pos => {
                    return pos["type"] === "terrain" && pos["terrain"] === "plain";
                });
                
                result = result.concat(freePositions);
            });
        });
        
        return result;
    }
}
module.exports = roleDelegator;