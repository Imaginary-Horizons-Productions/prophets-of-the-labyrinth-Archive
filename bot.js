//#region Imports
const { Client } = require("discord.js");
const versionData = require('./Data/Config/versionData.json');
const { commandDictionary, slashData } = require(`./Commands/_commandList.js`);
const { selectDictionary } = require("./Selects/_selectList.js");
const { buttonDictionary } = require("./Buttons/_buttonList.js");
const { loadPlayers } = require("./playerDictionary");
const { guildSetup } = require("./helpers");
const { loadGuilds } = require("./guildDictionary");
const { loadAdventures } = require("./adventureDictionary");
//#endregion

//#region Executing Code
const client = new Client({
	retryLimit: 5,
	presence: {
		activities: [{
			name: "/tutorial",
			type: "LISTENING"
		}]
	},
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
});

loadGuilds().then(() => {
	loadAdventures().then(() => {
		loadPlayers().then(() => {
			client.login(require("./Data/Config/auth.json").token);
		});
	})
})
//#endregion

//#region Event Handlers
client.on("ready", () => {
	console.log(`Connected as ${client.user.tag}`);
	//TODO upload slash commands gloabally
	//TODO post version notes
})

client.on("interactionCreate", interaction => {
	//TODO inGuild gate
	if (interaction.isCommand()) {
		var command = commandDictionary[interaction.commandName];
		//TODO premium gate
		if (!command.managerCommand || !interaction.member.manageable) {
			command.execute(interaction);
		} else {
			interaction.reply(`The \`/${interaction.commandName}\` command is restricted to bot managers (users with permissions above the bot).`)
		}
	} else if (interaction.isButton()) {
		var args = interaction.customId.split("-");
		buttonDictionary[args[0]].execute(interaction, args);
	} else if (interaction.isSelectMenu()) {
		//TODO value parsing
		selectDictionary[interaction.customId].execute(interaction);
	}
})

client.on("guildCreate", guild => {
	guildSetup(guild);
})
//#endregion
