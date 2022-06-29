var fs = require("fs");
const GuildProfile = require('../Classes/GuildProfile.js');
const { ensuredPathSave } = require("../helpers.js");

const dirPath = "./Saves";
const fileName = "guilds.json";
const filePath = `${dirPath}/${fileName}`;
const requirePath = "./../Saves/guilds.json";
const guildDictionary = new Map();

exports.loadGuilds = async function () {
	if (fs.existsSync(filePath)) {
		const guildProfiles = require(requirePath);
		guildProfiles.forEach(guildProfile => {
			guildProfile.adventuring = new Set();
			guildDictionary.set(guildProfile.id, guildProfile);
		})
		return `${guildProfiles.length} guilds loaded`;
	} else {
		ensuredPathSave(dirPath,fileName,"[]");
		return "guilds regenerated";
	}
}

exports.getGuild = function (guildId) {
	let guildProfile = guildDictionary.get(guildId);
	if (!guildProfile) {
		guildProfile = new GuildProfile(guildId);
		exports.setGuild(guildProfile);
	}
	return guildProfile;
}

exports.setGuild = function (guildProfile) {
	guildDictionary.set(guildProfile.id, guildProfile);
	ensuredPathSave("./Saves", "guilds.json", JSON.stringify(Array.from((guildDictionary.values()))));
}
