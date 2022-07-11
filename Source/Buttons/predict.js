const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, updateRoomHeader, setAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const { getFullName, calculateTotalSpeed, modifiersToString } = require("../combatantDAO.js");
const { getWeakness, getColor, getEmoji } = require('../elementHelpers.js');

const id = "predict";
module.exports = new Button(id, (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.getChallengeDuration("Blind Avarice") > 0) {
		let cost = adventure.getChallengeIntensity("Blind Avarice");
		if (adventure.gold >= cost) {
			adventure.gold -= cost;
			interaction.channel.messages.fetch(adventure.messageIds.battleRound).then(roomMessage => {
				updateRoomHeader(adventure, roomMessage);
				setAdventure(adventure);
			})
		} else {
			return interaction.reply({ content: "*Blind Avarice* prevents you from predicting until you get more gold.", ephemeral: true });
		}
	}
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed().setColor(getColor(adventure.room.element))
		.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
	let infoForNextRound = true;
	let descriptionText = "";
	switch (delver.predict) {
		case "Movements": // Shows speed, stagger and poise of all combatants
			const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
				.concat(adventure.delvers)
				.sort((first, second) => {
					return calculateTotalSpeed(second) - calculateTotalSpeed(first);
				});
			for (const combatant of activeCombatants) {
				const staggerCount = combatant.getModifierStacks("Stagger");
				let bar = "";
				for (let i = 0; i < combatant.staggerThreshold; i++) {
					if (staggerCount > i) {
						bar += "▰";
					} else {
						bar += "▱";
					}
				}
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\nStagger: ${bar}\nSpeed: ${calculateTotalSpeed(combatant)}\n`;
			}
			descriptionText += "\nCombatants tied in speed may act in any order.";
			break;
		case "Vulnerabilities": // Shows elemental affinities and if critically hitting this turn for all combatants
			infoForNextRound = false;
			adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__ ${getEmoji(combatant.element)}\nCritical Hit: ${combatant.crit}\nWeakness: ${getEmoji(getWeakness(combatant.element))}\nResistance: ${getEmoji(combatant.element)}\n`;
			});
			break;
		case "Intents": // Shows each enemy's target(s) in the next round and the names of the next two moves
			adventure.room.priorityMoves.forEach(({ userTeam, userIndex, targets, name }) => {
				if (userTeam === "enemy") {
					const enemy = adventure.room.enemies[userIndex];
					if (enemy.hp > 0) {
						const targetNames = getTargetList(targets, adventure);
						descriptionText += `\n__${getFullName(enemy, adventure.room.enemyTitles)}__\nRound ${adventure.room.round + 1} (Priority): ${name} (Targets: ${targetNames.length ? targetNames.join(", ") : "???"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}\n`;
					}
				}
			})
			adventure.room.moves.forEach(({ userTeam, userIndex, targets, name }) => {
				if (userTeam === "enemy") {
					const enemy = adventure.room.enemies[userIndex];
					if (enemy.hp > 0) {
						const targetNames = getTargetList(targets, adventure);
						descriptionText += `\n__${getFullName(enemy, adventure.room.enemyTitles)}__\nRound ${adventure.room.round + 1}: ${name} (Targets: ${targetNames.length ? targetNames.join(", ") : "???"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}\n`;
					}
				}
			})
			break;
		case "Health": // Shows hp and modifiers for all combatants
			infoForNextRound = false;
			adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
				let modifiersText = modifiersToString(combatant, false);
				descriptionText += `\n__${getFullName(combatant, adventure.room.enemyTitles)}__\n${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers\n"}`;
			})
			break;
	}
	embed.setTitle(`${delver.predict} ${infoForNextRound ? "Predictions for" : "State of"} Round ${infoForNextRound ? adventure.room.round + 1 : adventure.room.round}`)
		.setDescription(descriptionText);
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
});
