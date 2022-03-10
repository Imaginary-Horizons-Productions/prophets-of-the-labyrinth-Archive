const Player = require("../Classes/Player.js");
const fs = require("fs");

let ensuredPathSave, getGuild, saveGuilds;
exports.injectConfig = function (isProduction) {
	({ getGuild, saveGuilds } = require("./guildDAO.js").injectConfig(isProduction));
	({ ensuredPathSave } = require("../helpers.js").injectConfig(isProduction));
	return this;
}

const filePath = "./Saves/players.json";
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
		if (!fs.existsSync("./Saves")) {
			fs.mkdirSync("./Saves", { recursive: true });
		}
		fs.writeFile(filePath, "[]", "utf8", error => {
			if (error) {
				console.error(error);
			}
		})
		return "players regenerated";
	}
}

exports.getPlayer = function (playerId, guildId) {
	if (!playerDictionary.has(playerId)) {
		exports.setPlayer(new Player(playerId));
		let guildProfile = getGuild(guildId);
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
