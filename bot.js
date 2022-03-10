//#region Imports
const { Client } = require("discord.js");
const fsa = require("fs").promises;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const versionData = require('./Config/versionData.json');

const isProduction = true;
const { loadAdventures } = require("./Source/adventureDAO.js").initialize(isProduction);
const { loadGuilds } = require("./Source/guildDAO.js").initialize(isProduction);
const { loadPlayers } = require("./Source/playerDAO.js").initialize(isProduction);
const { getCommand, initializeCommands, slashData } = require(`./Source/Commands/_commandDictionary.js`);
const { getSelect } = require("./Source/Selects/_selectDictionary.js");
const { getButton } = require("./Source/Buttons/_buttonDictionary.js");
const { guildSetup, getPremiumUsers, versionEmbedBuilder } = require("./helpers.js");
//#endregion

//#region Executing Code
const client = new Client({
	retryLimit: 5,
	presence: {
		activities: [{
			name: "/manual",
			type: "LISTENING"
		}]
	},
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
});

(async () => {
	try {
		console.log(await loadGuilds());
		console.log(await loadAdventures());
		console.log(await loadPlayers());
		client.login(require("./Config/auth.json").token);
	} catch (rejectMessage) {
		console.error(rejectMessage);
	}
})()
//#endregion

//#region Event Handlers
client.on("ready", () => {
	console.log(`Connected as ${client.user.tag}`);

	initializeCommands(true);
	// Post version notes
	if (versionData.announcementsChannelId) {
		fsa.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
			let [currentFull, currentMajor, currentMinor, currentPatch] = data.match(/(\d+)\.(\d+)\.(\d+)/);
			let [_lastFull, lastMajor, lastMinor, lastPatch] = versionData.lastPostedVersion.match(/(\d+)\.(\d+)\.(\d+)/);

			if (currentMajor <= lastMajor) {
				if (currentMinor <= lastMinor) {
					if (currentPatch <= lastPatch) {
						return;
					}
				}
			}

			versionEmbedBuilder(client.user.displayAvatarURL()).then(embed => {
				client.guilds.fetch(versionData.guildId).then(guild => {
					guild.channels.fetch(versionData.announcementsChannelId).then(annoucnementsChannel => {
						annoucnementsChannel.send({ embeds: [embed] }).then(message => {
							message.crosspost();
							versionData.lastPostedVersion = currentFull;
							fsa.writeFile('./Config/versionData.json', JSON.stringify(versionData), "utf-8");
						});
					})
				})
			}).catch(console.error);
		});
	}

	// Upload slash commands globally
	(async () => {
		try {
			await new REST({ version: 9 }).setToken(require("./Config/auth.json").token).put(
				Routes.applicationCommands(client.user.id),
				{ body: slashData },
			);
		} catch (error) {
			console.error(error);
		}
	})();
})

client.on("interactionCreate", interaction => {
	if (interaction.inGuild()) {
		if (interaction.isCommand()) {
			let command = getCommand(interaction.commandName);
			if (!command.premiumCommand || !getPremiumUsers().includes(interaction.user.id)) {
				if (!command.managerCommand || !interaction.member.manageable) {
					command.execute(interaction);
				} else {
					interaction.reply(`The \`/${interaction.commandName}\` command is restricted to bot managers (users with permissions above the bot).`)
						.catch(console.error);
				}
			} else {
				interaction.reply(`The \`/${interaction.commandName}\` command is a premium command. Use \`/support\` for more information.`)
					.catch(console.error);
			}
		} else if (interaction.isButton()) {
			let args = interaction.customId.split("-");
			let command = args.shift();
			getButton(command).execute(interaction, args);
		} else if (interaction.isSelectMenu()) {
			let args = interaction.customId.split("-");
			let command = args.shift();
			getSelect(command).execute(interaction, args);
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
