const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Adventure = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const { elementsList, getColor } = require('../elementHelpers.js');
const Delver = require('../../Classes/Delver.js');
const { generateRandomNumber } = require('../../helpers.js');
const { setAdventure } = require("../adventureDAO.js");
const { prerollBoss } = require('../Rooms/_roomDictionary.js');

module.exports = new Command("delve", "Start a new adventure", false, false);
module.exports.data.addStringOption(option => option.setName("seed").setDescription("The value to base the random events of the run on").setRequired(false));

let DESCRIPTORS = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future", "Intense"];
let LOCATIONS = ["Adventure", "Castle", "Labyrinth", "Ruins", "Plateau", "Dungeon", "Maze", "Fortress", "Dream"];

module.exports.execute = (interaction) => {
	// Start a new adventure
	if (interaction.channel.type === "GUILD_TEXT") {
		let adventure = new Adventure(interaction.options.getString("seed")).generateRNTable();

		// roll bosses
		prerollBoss("Final Battle", adventure);
		prerollBoss("Artifact Guardian", adventure);

		let elementIndex = generateRandomNumber(adventure, elementsList().length, "general");
		let pickedElement = elementsList()[elementIndex];
		adventure.setName(`${DESCRIPTORS[generateRandomNumber(adventure, DESCRIPTORS.length, "general")]} ${LOCATIONS[generateRandomNumber(adventure, LOCATIONS.length, "general")]} of ${pickedElement}`)
			.setElement(pickedElement);

		let embed = new MessageEmbed().setColor(getColor(pickedElement))
			.setAuthor({ name: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png", url: "https://github.com/Imaginary-Horizons-Productions/dungeon-tamers" })
			.setTitle(adventure.name)
			.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734093574031016006/bountyboard.png")
			.setDescription("A new adventure is starting!")
			.addField("1 Party Member", `Leader: ${interaction.member}`)
		let join = new MessageActionRow().addComponents(
			new MessageButton().setCustomId(`join`)
				.setLabel("Join")
				.setStyle("SUCCESS")
		)
		interaction.reply({ embeds: [embed], components: [join], fetchReply: true }).then(recruitMessage => {
			return recruitMessage.startThread({ name: adventure.name });
		}).then(thread => {
			adventure.delvers.push(new Delver(interaction.user.id, interaction.member.displayName, thread.id));

			thread.send(`${interaction.user} Here's the channel for your new adventure. As adventure leader you're responsible for indicating when everyone's ready.`).then(leaderMessage => {
				let ready = new MessageActionRow().addComponents(
					new MessageButton().setCustomId("deploy")
						.setLabel("Pick an Archetype")
						.setStyle("PRIMARY"),
					new MessageButton().setCustomId("difficulty")
						.setLabel("Vote on Difficulty Options (coming soon)")
						.setStyle("DANGER")
						.setDisabled(true)
				)
				adventure.setId(thread.id)
					.setLeaderId(interaction.user.id);
				adventure.messageIds.leaderNotice = leaderMessage.id;
				return thread.send({ content: "The adventure will begin when everyone has picked an archetype and the leader clicks the \"Ready!\" button.", components: [ready] });
			}).then(deployMessage => {
				adventure.messageIds.deploy = deployMessage.id;
				setAdventure(adventure);
			});
		}).catch(console.error);
	} else {
		interaction.reply({ content: "Threads cannot be made in thread channels, please start your adventure in a text channel.", ephemeral: true });
	}
}
