//#region Imports
const { Client } = require("discord.js");
const versionData = require('./Config/versionData.json');
const { commandDictionary, slashData } = require(`./Data/Commands/_commandList.js`);
const { selectDictionary } = require("./Data/Selects/_selectList.js");
const { buttonDictionary } = require("./Data/Buttons/_buttonList.js");
const { loadPlayers } = require("./Data/playerDictionary.js");
const { guildSetup } = require("./helpers.js");
const { loadGuilds } = require("./Data/guildDictionary.js");
const { loadAdventures } = require("./Data/adventureDictionary.js");
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
			client.login(require("./Config/auth.json").token);
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
	if (interaction.inGuild()) {
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
	} else {
		interaction.reply({ content: "Direct message commands are not supported at this time.", ephemeral: true })
			.catch(console.error);
	}
})

client.on("guildCreate", guild => {
	guildSetup(guild);
})
//#endregion
