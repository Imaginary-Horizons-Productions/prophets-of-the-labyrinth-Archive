const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const { getFullName, calculateTotalSpeed, modifiersToString } = require("../combatantDAO.js");
const DamageType = require('../../Classes/DamageType.js');

module.exports = new Button("predict");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed().setFooter(`Room #${adventure.depth} - Round ${adventure.room.round}`);
	let infoForNextRound = true;
	let descriptionText = "";
	switch (delver.predict) {
		case "Targets": // Shows who the enemies are targeting next round and elemental resistances
			adventure.room.moves.forEach(move => {
				let team = move.team === "ally" ? adventure.delvers : adventure.room.enemies;
				let user = team[move.userIndex];
				if (user.hp > 0) {
					let targets = getTargetList(move.targets, adventure);
					descriptionText += `\n__${getFullName(user, adventure.room.enemyTitles)}__\nTargeting: **${targets.length ? targets.join(", ") : "???"}**\nResistances: ${DamageType.getResistances(user.element).join(", ")}\n`;
				}
			})
			break;
		case "Critical Hits": // Shows which combatants are going to critically hit next round and elemental weakness
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\nCritical Hit: ${combatant.crit}\nWeaknesses: ${DamageType.getWeaknesses(combatant.element).join(", ")}\n`;
			});
			break;
		case "Health": // Shows current HP, max HP, block, and element of all combatants
			infoForNextRound = false;
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `\n__${combatant.name}__\n${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\nElement: ${combatant.element}\n`;
			})
			break;
		case "Move Order": // Shows roundly random speed bonuses and order of move resolution
			adventure.room.enemies.concat(adventure.delvers).sort((first, second) => {
				return calculateTotalSpeed(second) - calculateTotalSpeed(first);
			}).filter(combatant => combatant.hp > 0).forEach((combatant, i) => {
				descriptionText += `\n${i + 1}: ${getFullName(combatant, adventure.room.enemyTitles)} (${combatant.roundSpeed >= 0 ? "+" : ""}${combatant.roundSpeed + combatant.actionSpeed} bonus speed this round)`;
			});
			break;
		case "Modifiers": // Shows modifiers and stagger thresholds for all combatants
			infoForNextRound = false;
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				let modifiersText = modifiersToString(combatant);
				let staggerCount = combatant.modifiers.Stagger || 0;
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\n*${staggerCount} out of ${combatant.staggerThreshold} Stagger* for Stun\n${modifiersText ? `${modifiersText}` : "No modifiers"}\n`;
			})
			break;
	}
	embed.setTitle(`${delver.predict} ${infoForNextRound ? "Predictions for" : "State of"} Round ${infoForNextRound ? adventure.room.round + 1 : adventure.room.round}`)
		.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.log)
}
