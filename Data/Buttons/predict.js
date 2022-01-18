const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const { getFullName, calculateTotalSpeed, modifiersToString } = require("../combatantDAO.js");
const { getResistances, getWeaknesses } = require('../elementHelpers.js');
const { ordinalSuffixEN } = require('../../helpers.js');

module.exports = new Button("predict");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed().setColor(adventure.room.embedColor)
		.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
	let infoForNextRound = true;
	let descriptionText = "";
	switch (delver.predict) {
		case "Targets": // Shows who the enemies are targeting next round and elemental resistances
			adventure.room.moves.forEach(move => {
				let team = move.userTeam === "delver" ? adventure.delvers : adventure.room.enemies;
				let user = team[move.userIndex];
				if (user.hp > 0) {
					let targets = getTargetList(move.targets, adventure);
					descriptionText += `\n__${getFullName(user, adventure.room.enemyTitles)}__\nTargeting: **${targets.length ? targets.join(", ") : "???"}**\nResistances: ${getResistances(user.element).join(", ")}\n`;
				}
			})
			break;
		case "Critical Hits": // Shows which combatants are going to critically hit next round and elemental weakness
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\nCritical Hit: ${combatant.crit}\nWeaknesses: ${getWeaknesses(combatant.element).join(", ")}\n`;
			});
			break;
		case "Health": // Shows current HP, max HP, block, and element of all combatants
			infoForNextRound = false;
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\n${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\nElement: ${combatant.element}\n`;
			})
			break;
		case "Move Order": // Shows roundly random speed bonuses and order of move resolution
			let combatants = adventure.room.enemies.concat(adventure.delvers)
				.filter(combatant => combatant.hp > 0)
				.sort((first, second) => {
					return calculateTotalSpeed(second) - calculateTotalSpeed(first);
				});
			let numeral = 0;
			let tempSpeed;
			for (const combatant of combatants) {
				let speed = calculateTotalSpeed(combatant);
				if (speed !== tempSpeed) {
					tempSpeed = speed;
					numeral++;
					descriptionText += `\n__**${ordinalSuffixEN(numeral)}** - ${speed} speed__ ${getFullName(combatant, adventure.room.enemyTitles)}`;
				} else {
					descriptionText += `, ${getFullName(combatant, adventure.room.enemyTitles)}`;
				}
			}
			descriptionText += "\n\nCombatants tied in speed may act in any order.";
			break;
		case "Modifiers": // Shows modifiers and stagger thresholds for all combatants
			infoForNextRound = false;
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				let modifiersText = modifiersToString(combatant);
				let staggerCount = combatant.modifiers.Stagger || 0;
				let bar = "";
				for (let i = 0; i < combatant.staggerThreshold; i++) {
					if (staggerCount > i) {
						bar += "▰";
					} else {
						bar += "▱";
					}
				}
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__ ${bar}\n${modifiersText ? `${modifiersText}` : "No modifiers\n"}`;
			})
			break;
		case "Enemy Moves": // Shows name of enemy next two round's move
			adventure.room.moves.forEach(move => {
				let enemy = adventure.room.enemies[move.userIndex];
				if (enemy.hp > 0 && move.userTeam === "enemy") {
					descriptionText += `\n__${getFullName(enemy, adventure.room.enemyTitles)}__\nRound ${adventure.room.round + 1}: ${move.name === "random" ? "???" : move.name}\nRound ${adventure.room.round + 2}: ${enemy.nextAction === "random" ? "???" : enemy.nextAction}\n`;
				}
			})
			break;
	}
	embed.setTitle(`${delver.predict} ${infoForNextRound ? "Predictions for" : "State of"} Round ${infoForNextRound ? adventure.room.round + 1 : adventure.room.round}`)
		.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
