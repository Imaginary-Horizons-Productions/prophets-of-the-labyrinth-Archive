var fs = require("fs");
const { ensuredPathSave } = require("../helpers.js");
const GuildProfile = require('../Classes/GuildProfile.js');

var filePath = "./Saves/guilds.json";
var requirePath = "./../Saves/guilds.json";
var guildDictionary = new Map();

exports.loadGuilds = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var guildProfiles = require(requirePath);
			guildProfiles.forEach(guildProfile => {
				guildDictionary.set(guildProfile.id, guildProfile);
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
		resolve(`${guildProfiles.length} guilds loaded`);
	})
}

exports.guildSetup = function (guild) {
	return guild.channels.create("Dungeon Tamers", {
		type: "GUILD_CATEGORY"
	}).then(category => {
		return guild.channels.create("dungeon-tamers-central", {
			type: "GUILD_TEXT",
			parent: category
		}).then(channel => {
			let guildProfile = new GuildProfile(guild.id, category.id, channel.id);
			exports.saveGuild(guildProfile);
			return guildProfile;
		})
	})
}

exports.getGuild = function (guildId) {
	return guildDictionary.get(guildId);
}

exports.setGuild = function (guildProfile) {
	guildDictionary.set(guildProfile.id, guildProfile);
	exports.saveGuilds();
}

exports.saveGuilds = function () {
	ensuredPathSave("./Saves", "guilds.json", JSON.stringify(Array.from((guildDictionary.values()))));
}
