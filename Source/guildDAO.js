var fs = require("fs");
const { ensuredPathSave } = require("../helpers.js");
const GuildProfile = require('../Classes/GuildProfile.js');

const filePath = "./Saves/guilds.json";
const requirePath = "./../Saves/guilds.json";
const guildDictionary = new Map();

exports.loadGuilds = async function () {
	if (fs.existsSync(filePath)) {
		const guildProfiles = require(requirePath);
		guildProfiles.forEach(guildProfile => {
			guildDictionary.set(guildProfile.id, guildProfile);
		})
		return `${guildProfiles.length} guilds loaded`;
	} else {
		if (!fs.existsSync("./Saves")) {
			fs.mkdirSync("./Saves", { recursive: true });
		}
		fs.writeFile(filePath, "[]", "utf8", error => {
			if (error) {
				console.error(error);
			}
		})
		return "guilds regenerated";
	}
}

exports.guildSetup = function (guild) {
	return guild.channels.create("Prophets of the Labyrinth", {
		type: "GUILD_CATEGORY"
	}).then(category => {
		return guild.channels.create("potl-central", {
			type: "GUILD_TEXT",
			parent: category
		}).then(channel => {
			let guildProfile = new GuildProfile(guild.id);
			exports.setGuild(guildProfile);
			return guildProfile;
		})
	})
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
	exports.saveGuilds();
}

exports.saveGuilds = function () {
	ensuredPathSave("./Saves", "guilds.json", JSON.stringify(Array.from((guildDictionary.values()))));
}
