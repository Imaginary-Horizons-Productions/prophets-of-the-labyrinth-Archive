const Player = require("../Classes/Player.js");
const fs = require("fs");

let ensuredPathSave, getGuild, setGuild;
exports.injectConfig = function (isProduction) {
	({ getGuild, setGuild } = require("./guildDAO.js").injectConfig(isProduction));
	({ ensuredPathSave } = require("../helpers.js").injectConfig(isProduction));
	return this;
}

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
		ensuredPathSave(dirPath,fileName,"[]");
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
		let player = playerDictionary[id];
		player.scores[guildId] = 0;
		exports.setPlayer(player);
	})
}
