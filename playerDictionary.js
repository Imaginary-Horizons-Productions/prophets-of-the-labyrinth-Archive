const Player = require("./Classes/Player");

var playerDictionary = new Map();

exports.loadPlayers = function () {
    return new Promise((resolve, reject) => {
        //TODO implement
        resolve();
    })
}

exports.getPlayer = function (playerId) {
    if (!playerDictionary.has(playerId)) {
        playerDictionary.set(playerId, new Player(playerId));
    }
    return playerDictionary.get(playerId);
}

exports.savePlayer = function (player) {
    playerDictionary.set(player.id, player);
    //TODO save to file
}
