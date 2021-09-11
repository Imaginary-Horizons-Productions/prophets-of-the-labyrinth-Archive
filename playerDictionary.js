const Player = require("./Classes/Player");
const { getGuild, saveGuild } = require("./guildDictionary");

var playerDictionary = new Map();

exports.loadPlayers = function () {
    return new Promise((resolve, reject) => {
        //TODO implement
        resolve();
    })
}

exports.getPlayer = function (playerId, guildId) {
    if (!playerDictionary.has(playerId)) {
        exports.savePlayer(new Player(playerId));
        var guildProfile = getGuild(guildId);
        guildProfile.userIds.push(playerId);
        saveGuild(guildProfile);
    }
    return playerDictionary.get(playerId);
}

exports.savePlayer = function (player) {
    playerDictionary.set(player.id, player);
    //TODO save to file
}
