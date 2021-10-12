const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const Combatant = require("./../../Classes/Combatant.js");
const { getFullName } = require("./../combatantDAO.js");

module.exports = new Button("read");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle("Reading the Situation");
	let descriptionText = "";
	switch (delver.readType) {
		case "targets": // Shows who the enemies are targeting next round
			descriptionText += "__Enemy Targets__";
			adventure.battleMoves.forEach(move => {
				if (move.userTeam === "enemy") {
					let enemy = adventure.battleEnemies[move.userIndex];
					let target = adventure.delvers[move.targetIndex];
					descriptionText += `\nNext round, **${getFullName(enemy, adventure.battleEnemyTitles)}** intends to attack **${target.name}**`;
				}
			})
			break;
		case "weaknesses": // Shows which characters are going to critically hit next round and elemental weakness
			let combatants = adventure.battleEnemies.concat(adventure.delvers);
			descriptionText += "__Critical Hits__";
			combatants.forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.battleEnemyTitles)}: ${combatant.crit ? "Critical Hit" : "normal hit"}`;
			});
			descriptionText += "\n\n__Elemental Weaknesses__";
			combatants.forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.battleEnemyTitles)}: ${Combatant.getWeaknesses(combatant.element).join(", ")}`;
			})
			break;
		case "health": // Shows current HP, max HP, and block of all characters
			descriptionText += "Coming Soon!";
			break;
		case "speed": // Shows roundly random speed bonuses and order of move resolution
			descriptionText += "__Move Order__";
			adventure.battleEnemies.concat(adventure.delvers).sort((first, second) => {
				return (second.speed + second.roundSpeed) - (first.speed + first.roundSpeed);
			}).forEach(combatant => {
				descriptionText += `\n${i + 1}: ${getFullName(combatant, adventure.battleEnemyTitles)} (${combatant.roundSpeed >= 0 ? `+${combatant.roundSpeed}` : `${combatant.roundSpeed}`} speed)`
			});
			//TODO #41 add elemental strengths
			break;
		case "stagger": // Shows current pressure and stagger thresholds for all characters
			//TODO consider adding enemy modifiers
			descriptionText += "Coming Soon!";
			break;
	}
	embed.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.log)
}
