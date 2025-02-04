const Command = require('../../Classes/Command.js');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS } = require('../../constants.js');
const { getAdventure } = require('../adventureDAO.js');

const id = "party-stats";
const options = [];
module.exports = new Command(id, "Get info about the current adventure", false, false, options);

/** Show user the party stats */
module.exports.execute = (interaction) => {
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("Party Stats")
			.setDescription(`${adventure.name} - Depth: ${adventure.depth}`)
			.addFields([
				{ name: `${adventure.lives} Lives Remaining`, value: "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end." },
				{ name: `${adventure.gold} Gold`, value: "Gold is exchanged for goods and services within adventures. Gold *will be lost when an adventure ends*." },
				{ name: "Consumables", value: Object.keys(adventure.consumables).map(consumable => `${consumable} x ${adventure.consumables[consumable]}`).join("\n") || "None" },
				{
					name: "Scouting", value: `Final Battle: ${adventure.scouting.finalBoss ? adventure.finalBoss : "???"}\nArtifact Guardians: ${adventure.artifactGuardians.slice(0, adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians).map((encounter, index) => {
						if (index + 1 <= adventure.scouting.artifactGuardiansEncountered) {
							return `~~${encounter}~~`;
						} else {
							return encounter;
						}
					}).join(", ")
						}...`
				}
			])
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
		let challenges = Object.keys(adventure.challenges);
		if (challenges.length) {
			embed.addFields({ name: "Challenges", value: Object.keys(adventure.challenges).join(", ") });
		}
		const infoSelects = [];
		const allArtifacts = Object.keys(adventure.artifacts);
		const artifactPages = [];
		for (let i = 0; i < allArtifacts.length; i += MAX_SELECT_OPTIONS) {
			artifactPages.push(allArtifacts.slice(i, i + MAX_SELECT_OPTIONS));
		}
		if (artifactPages.length > 0) {
			embed.addFields({ name: "Artifacts", value: Object.entries(adventure.artifacts).map(entry => `${entry[0]} x ${entry[1].count}`).join(", ") })
			infoSelects.push(...artifactPages.slice(0, MAX_MESSAGE_ACTION_ROWS).map((page, index) =>
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`artifact${SAFE_DELIMITER}${index}`)
						.setPlaceholder(`Get details about an artifact...${artifactPages.length > 1 ? ` (Page ${index + 1})` : ""}`)
						.setOptions(page.map(artifact => ({
							label: `${artifact} x ${adventure.artifacts[artifact].count}`,
							value: `${artifact}${SAFE_DELIMITER}${adventure.artifacts[artifact].count}`
						})
						))
				)
			))
		} else {
			infoSelects.push(new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`artifact`)
					.setPlaceholder("No artifacts to inspect...")
					.setDisabled(true)
					.setOptions([{
						label: "placeholder",
						value: "placeholder"
					}])
			))
		}
		interaction.reply({ embeds: [embed], components: infoSelects, ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
	}
}
