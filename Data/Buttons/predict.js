const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const Combatant = require("../../Classes/Combatant.js");
const { getFullName, calculateTotalSpeed, modifiersToString } = require("../combatantDAO.js");

module.exports = new Button("predict");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle(`Predicting: ${delver.predict}`)
		.setFooter(`Room #${adventure.depth} - Round ${adventure.room.round}`);
	let descriptionText = "";
	switch (delver.predict) {
		case "Targets": // Shows who the enemies are targeting next round
			adventure.room.moves.forEach(move => {
				let user = adventure.room.enemies[move.userIndex];
				if (move.userTeam === "enemy" && user.hp > 0) {
					let enemy = adventure.room.enemies[move.userIndex];
					let targets = getTargetList(move.targets, adventure);
					descriptionText += `\nNext round, **${getFullName(enemy, adventure.room.enemyTitles)}** intends to attack **${targets.join(", ")}**`;
				}
			})
			break;
		case "Critical Hits": // Shows which combatants are going to critically hit next round
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.room.enemyTitles)}: ${combatant.crit ? "Critical Hit" : "normal hit"}`;
			});
			break;
		case "Health": // Shows current HP, max HP, block, elemental weakness and resistances of all combatants
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `__${combatant.name}__\n${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\nResistances: ${Combatant.getResistances(combatant.element).join(", ")}\nWeaknesses: ${Combatant.getWeaknesses(combatant.element).join(", ")}\n\n`;
			})
			break;
		case "Move Order": // Shows roundly random speed bonuses and order of move resolution
			adventure.room.enemies.concat(adventure.delvers).sort((first, second) => {
				return calculateTotalSpeed(second) - calculateTotalSpeed(first);
			}).filter(combatant => combatant.hp > 0).forEach((combatant, i) => {
				descriptionText += `\n${i + 1}: ${getFullName(combatant, adventure.room.enemyTitles)} (${combatant.roundSpeed >= 0 ? "+" : ""}${combatant.roundSpeed} bonus speed this round${Object.keys(combatant.modifiers).includes("Slow") ? `; speed halved due to *Slow* modifier` : ""}${Object.keys(combatant.modifiers).includes("Quicken") ? `; speed doubled due to *Quicken* modifier` : ""})`
			});
			break;
		case "Modifiers": // Shows modifiers and stagger thresholds for all combatants
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				let modifiersText = modifiersToString(combatant);
				descriptionText += `__${getFullName(combatant, adventure.room.enemyTitles)}__\nStunned at *${combatant.staggerThreshold} Stagger*\n${modifiersText ? `${modifiersText}` : ""}\n`;
			})
			break;
	}
	embed.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.log)
}
