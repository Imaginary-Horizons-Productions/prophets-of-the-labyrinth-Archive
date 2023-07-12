const Player = require("../Classes/Player.js");
const fs = require("fs");
const { ensuredPathSave } = require("../helpers.js");
const { getGuild, setGuild } = require("./guildDAO.js");

const dirPath = "./Saves"
const fileName = "players.json";
const filePath = `${dirPath}/${fileName}`;

const requirePath = "./../Saves/players.json";
const playerDictionary = new Map();

exports.loadPlayers = async function () {
	if (fs.existsSync(filePath)) {
		const players = require(requirePath);
		players.forEach(player => {
			playerDictionary.set(player.id, player);
		})
		return `${players.length} players loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "players regenerated";
	}
}

exports.getPlayer = function (playerId, guildId) {
	if (!playerDictionary.has(playerId)) {
		exports.setPlayer(new Player(playerId));
		let guildProfile = getGuild(guildId);
		guildProfile.userIds.push(playerId);
		setGuild(guildProfile);
	}
	return playerDictionary.get(playerId);
}

exports.setPlayer = function (player) {
	playerDictionary.set(player.id, player);
	ensuredPathSave("./Saves", "players.json", JSON.stringify(Array.from((playerDictionary.values()))));
}

exports.resetScores = function (userIds, guildId) {
	userIds.forEach(id => {
		let player = playerDictionary.get(id);
		player.scores[guildId] = { total: 0, high: 0 };
		exports.setPlayer(player);
	})
}
