//#region Imports
const { Client } = require("discord.js");
const versionData = require('./Data/Config/versionData.json');
const { commandDictionary, slashData } = require(`./Commands/_commandList.js`);
const { selectDictionary } = require("./Selects/_selectList.js");
const { buttonDictionary } = require("./Buttons/_buttonList.js");
const { loadPlayers } = require("./playerDictionary");
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

//TODO load guilds
//TODO load adventures
loadPlayers().then(() => {
	client.login(require("./Data/Config/auth.json").token);
});
//#endregion

//#region Event Handlers
client.on("ready", () => {
	console.log(`Connected as ${client.user.tag}`);
	//TODO upload slash commands gloabally
	//TODO post version notes
})

client.on("interactionCreate", interaction => {
	if (interaction.isCommand()) {
		commandDictionary[interaction.commandName].execute(interaction);
	} else if (interaction.isButton()) {
		//TODO customId parsing
		buttonDictionary[interaction.customId].execute(interaction);
	} else if (interaction.isSelectMenu()) {
		//TODO value parsing
		selectDictionary[interaction.customId].execute(interaction);
	}
})

client.on("guildCreate", guild => {
	//TODO create category and general text channel
})
//#endregion
