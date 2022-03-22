var fs = require("fs");
const GuildProfile = require('../Classes/GuildProfile.js');

let ensuredPathSave;
exports.injectConfig = function (isProduction) {
	({ ensuredPathSave } = require("../helpers.js").injectConfig(isProduction));
	return this;
}
const filePath = "./Saves/guilds.json";
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

exports.guildSetup = function (guild) { //TODO #273 remove channel creation logic
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
	saveGuilds();
}

function saveGuilds() {
	ensuredPathSave("./Saves", "guilds.json", JSON.stringify(Array.from((guildDictionary.values()))));
}
