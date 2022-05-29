const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const Adventure = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const Delver = require('../../Classes/Delver.js');
const { setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');
const { elementsList, getColor } = require('../elementHelpers.js');
const { getGuild } = require('../guildDAO.js');
const { prerollBoss } = require('../Rooms/_roomDictionary.js');
const { SAFE_DELIMITER, isSponsor, generateRandomNumber } = require('./../../helpers.js');

const options = [
	{ type: "String", name: "seed", description: "The value to base the run's random events on", required: false, choices: [] }
];
module.exports = new Command("delve", "Start a new adventure", false, false, options);

let DESCRIPTORS = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future", "Intense"];
let LOCATIONS = ["Adventure", "Castle", "Labyrinth", "Ruins", "Plateau", "Dungeon", "Maze", "Fortress", "Dream"];

module.exports.execute = (interaction) => {
	// Start a new adventure
	if (interaction.inGuild()) {
		let guildProfile = getGuild(interaction.guildId);
		if (isSponsor(interaction.user.id) || !guildProfile.adventuring.has(interaction.user.id)) {
			if (interaction.channel.type === "GUILD_TEXT") {
				let adventure = new Adventure(interaction.options.getString("seed"), interaction.guildId).generateRNTable();
				// roll bosses
				prerollBoss("Final Battle", adventure);
				prerollBoss("Artifact Guardian", adventure);

				let elementPool = elementsList();
				let pickedElement = elementPool[generateRandomNumber(adventure, elementPool.length, "general")];
				adventure.setName(`${DESCRIPTORS[generateRandomNumber(adventure, DESCRIPTORS.length, "general")]} ${LOCATIONS[generateRandomNumber(adventure, LOCATIONS.length, "general")]} of ${pickedElement}`)
					.setElement(pickedElement);

				let embed = new MessageEmbed().setColor(getColor(pickedElement))
					.setAuthor({ name: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png", url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
					.setTitle(adventure.name)
					.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734093574031016006/bountyboard.png")
					.setDescription("A new adventure is starting!")
					.addField("1 Party Member", `Leader: ${interaction.member}`)
				interaction.reply({ embeds: [embed], fetchReply: true }).then(recruitMessage => {
					return recruitMessage.startThread({ name: adventure.name }).then(thread => {
						recruitMessage.edit({
							components: [new MessageActionRow().addComponents(
								new MessageButton().setCustomId(`join${SAFE_DELIMITER}${thread.guildId}${SAFE_DELIMITER}${thread.id}${SAFE_DELIMITER}recruit`)
									.setLabel("Join")
									.setStyle("SUCCESS")
							)]
						});
						adventure.delvers.push(new Delver(interaction.user.id, interaction.member.displayName, thread.id));
						guildProfile.adventuring.add(interaction.user.id);

						let options = [{ label: "None", description: "Deselect previously selected challenges", value: "None" }];
						["Can't Hold All this Value", "Restless"].forEach(challengeName => {
							const challenge = getChallenge(challengeName);
							options.push({ label: challengeName, description: challenge.dynamicDescription(challenge.intensity, challenge.duration), value: challengeName });
						})
						let components = [new MessageActionRow().addComponents(
							new MessageSelectMenu().setCustomId("startingchallenges")
								.setPlaceholder("👑 Select challenge(s)...")
								.setMinValues(1)
								.setMaxValues(options.length)
								.addOptions(options)
						)];

						thread.send({
							content: `${interaction.user} Here's the channel for your new adventure. As adventure leader you're responsible for inputting the group's decisions (indicated with a 👑).`,
							components
						}).then(leaderMessage => {
							let ready = new MessageActionRow().addComponents(
								new MessageButton().setCustomId("deploy")
									.setLabel("Pick Archetype")
									.setStyle("PRIMARY"),
								new MessageButton().setCustomId("viewstartingartifacts")
									.setLabel("Pick Starting Artifact")
									.setStyle("SECONDARY")
							)
							adventure.setId(thread.id)
								.setLeaderId(interaction.user.id);
							adventure.messageIds.leaderNotice = leaderMessage.id;
							return thread.send({ content: "The adventure will begin when everyone has picked an archetype and the leader clicks the \"Ready!\" button. Each player can optionally select a starting artifact.", components: [ready] });
						}).then(deployMessage => {
							adventure.messageIds.deploy = deployMessage.id;
							setAdventure(adventure);
						});
					});
				}).catch(console.error);
			} else {
				interaction.reply({ content: "Threads cannot be made in thread channels, please start your adventure in a text channel.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Direct message delves are not supported at this time.", ephemeral: true });
	}
}
