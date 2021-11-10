const Player = require("../Classes/Player.js");
const { getGuild, saveGuilds } = require("./guildDAO.js");
const fs = require("fs");
const { ensuredPathSave } = require("../helpers.js");

var filePath = "./Saves/players.json";
var requirePath = "./../Saves/players.json";
var playerDictionary = new Map();

exports.loadPlayers = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var players = require(requirePath);
			players.forEach(player => {
				playerDictionary.set(player.id, player);
			})
		} else {
			if (!fs.existsSync("./Saves")) {
				fs.mkdirSync("./Saves", { recursive: true });
			}
			fs.writeFile(filePath, "[]", "utf8", error => {
				if (error) {
					console.error(error);
				}
			})
		}
		resolve(`${players.length} players loaded`);
	})
}

exports.getPlayer = function (playerId, guildId) {
	if (!playerDictionary.has(playerId)) {
		exports.setPlayer(new Player(playerId));
		var guildProfile = getGuild(guildId);
		guildProfile.userIds.push(playerId);
		saveGuilds();
	}
	return playerDictionary.get(playerId);
}

exports.setPlayer = function (player) {
	playerDictionary.set(player.id, player);
	exports.savePlayers();
}

exports.resetScores = function (userIds, guildId) {
	userIds.forEach(id => {
		playerDictionary[id].scores[guildId] = 0;
	})
	exports.setPlayer(player);
}

exports.savePlayers = function () {
	ensuredPathSave("./Saves", "players.json", JSON.stringify(Array.from((playerDictionary.values()))));
}
