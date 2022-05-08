const Command = require('../../Classes/Command.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SAFE_DELIMITER } = require('../../helpers.js');

const options = [];
module.exports = new Command("party-stats", "Get info about the current adventure", false, false, options);

// imports from files that depend on /Config
let getAdventure;
module.exports.injectConfig = function (isProduction) {
	({ getAdventure } = require('../adventureDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Show user the party stats
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		let embed = new MessageEmbed()
			.setTitle("Party Stats")
			.setDescription(`${adventure.name} - Depth: ${adventure.depth}`)
			.addField(`${adventure.lives} Lives Remain`, "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end.")
			.addField(`${adventure.gold} Gold`, "Gold is exchanged for goods and services within adventures. Gold *will be lost when an adventure ends*.")
			.addField("Scouting", `Final Battle: ${adventure.scouting.finalBoss ? adventure.finalBoss : "???"}\nArtifact Guardians (${adventure.scouting.artifactGuardiansEncountered} encountered so far): ${adventure.artifactGuardians.slice(0, adventure.scouting.artifactGuardians).map((encounter, index) => {
				if (adventure.scouting.artifactGuardiansEncountered === index) {
					return `**${encounter}**`;
				} else {
					return encounter;
				}
			}).join(", ")}...`)
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
		let challenges = Object.keys(adventure.challenges);
		if (challenges.length) {
			embed.addField("Challenges", Object.keys(adventure.challenges).join(", "));
		}
		let artifactOptions = Object.keys(adventure.artifacts).map(artifact => {
			return {
				label: `${artifact} x ${adventure.artifacts[artifact].count}`,
				description: "",
				value: `${artifact}${SAFE_DELIMITER}${adventure.artifacts[artifact].count}`
			}
		})
		let artifactSelect;
		if (artifactOptions.length > 0) {
			embed.addField("Artifacts", Object.entries(adventure.artifacts).map(entry => `${entry[0]} x ${entry[1].count}`).join(", "))
			artifactSelect = [
				new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`artifact`)
						.setPlaceholder("Get details about an artifact...")
						.setOptions(artifactOptions)
				)
			]
		} else {
			artifactSelect = [
				new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`artifact`)
						.setPlaceholder("No artifacts to inspect...")
						.setDisabled(true)
						.setOptions([{
							label: "placeholder",
							description: "",
							value: "placeholder"
						}])
				)
			]
		}
		interaction.reply({ embeds: [embed], components: artifactSelect, ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
	}
}
