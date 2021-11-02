const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const Combatant = require("./../../Classes/Combatant.js");
const { getFullName, calculateTotalSpeed } = require("./../combatantDAO.js");

module.exports = new Button("read");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle(`Reading the Situation: ${delver.read.toUpperCase()}`);
	let descriptionText = "";
	let readCombatants;
	switch (delver.read) {
		case "targets": // Shows who the enemies are targeting next round
			descriptionText += "__Enemy Targets__";
			adventure.room.moves.forEach(move => {
				if (move.userTeam === "enemy") {
					let enemy = adventure.room.enemies[move.userIndex];
					let targets = getTargetList(move.targets, adventure);
					descriptionText += `\nNext round, **${getFullName(enemy, adventure.room.enemyTitles)}** intends to attack **${targets.join(", ")}**`;
				}
			})
			break;
		case "weaknesses": // Shows which combatants are going to critically hit next round and elemental weakness
			readCombatants = adventure.room.enemies.concat(adventure.delvers);
			descriptionText += "__Critical Hits__";
			readCombatants.forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.room.enemyTitles)}: ${combatant.crit ? "Critical Hit" : "normal hit"}`;
			});
			descriptionText += "\n\n__Elemental Weaknesses__";
			readCombatants.forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.room.enemyTitles)}: ${Combatant.getWeaknesses(combatant.element).join(", ")}`;
			})
			break;
		case "health": // Shows current HP, max HP, block, and resistances of all combatants
			readCombatants = adventure.room.enemies.concat(adventure.delvers)
			descriptionText += "__Health and Block__";
			readCombatants.forEach(combatant => {
				descriptionText += `\n${combatant.name}: ${combatant.hp}/${combatant.maxHp} HP, ${combatant.block} Block`;
			})
			descriptionText += "\n\n__Elemental Resistances__";
			readCombatants.forEach(combatant => {
				descriptionText += `\n${getFullName(combatant, adventure.room.enemyTitles)}: ${Combatant.getResistances(combatant.element).join(", ")}`;
			})
			break;
		case "speed": // Shows roundly random speed bonuses and order of move resolution
			descriptionText += "__Move Order__";
			adventure.room.enemies.concat(adventure.delvers).sort((first, second) => {
				return calculateTotalSpeed(second) - calculateTotalSpeed(first);
			}).forEach((combatant, i) => {
				descriptionText += `\n${i + 1}: ${getFullName(combatant, adventure.room.enemyTitles)} (${combatant.roundSpeed >= 0 ? "+" : ""}${combatant.roundSpeed} bonus speed this round${Object.keys(combatant.modifiers).includes("slow") ? `; speed halved due to *slow* modifier` : ""})`
			});
			break;
		case "stagger": // Shows current pressure and stagger thresholds for all combatants
			//TODO consider adding enemy modifiers
			descriptionText += "Coming Soon!";
			break;
	}
	embed.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.log)
}
