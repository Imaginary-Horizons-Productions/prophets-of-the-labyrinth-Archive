const { EmbedBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getTargetList } = require('../moveDAO.js');
const { calculateTotalSpeed, modifiersToString } = require("../combatantDAO.js");
const { getWeakness, getColor, getEmoji } = require('../elementHelpers.js');
const { updateRoomHeader } = require('../roomDAO.js');
const { generateTextBar } = require('../../helpers.js');

const customId = "predict";
module.exports = new Button(customId,
	/** Based on type, show the user information on the next battle round in an ephemeral message */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.getChallengeDuration("Blind Avarice") > 0) {
			const cost = adventure.getChallengeIntensity("Blind Avarice");
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
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.element))
			.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
		let infoForNextRound = true;
		switch (delver.predict) {
			case "Movements": // Shows speed, stagger and poise of all combatants
				const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
					.concat(adventure.delvers)
					.sort((first, second) => {
						return calculateTotalSpeed(second) - calculateTotalSpeed(first);
					});
				for (const combatant of activeCombatants) {
					const staggerCount = combatant.getModifierStacks("Stagger");
					embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}\nSpeed: ${calculateTotalSpeed(combatant)}` });
				}
				embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
				break;
			case "Vulnerabilities": // Shows elemental affinities and if critically hitting this turn for all combatants
				infoForNextRound = false;
				adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
					embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)} ${getEmoji(combatant.element)}}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeakness: ${getEmoji(getWeakness(combatant.element))}\nResistance: ${getEmoji(combatant.element)}` });
				});
				break;
			case "Intents": // Shows each enemy's target(s) in the next round and the names of the next two moves and if their move has priority
				adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
					if (userReference.team === "enemy") {
						const enemy = adventure.getCombatant(userReference);
						if (enemy.hp > 0) {
							const targetNames = getTargetList(targets, adventure);
							if (name !== "@{clone}") {
								embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}(Targets: ${targetNames.length ? targetNames.join(", ") : "???"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}` });
							} else {
								embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: "Mirror Clones mimic your allies!" })
							}
						}
					}
				})
				break;
			case "Health": // Shows hp and modifiers for all combatants
				infoForNextRound = false;
				adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
					let modifiersText = modifiersToString(combatant, false, adventure);
					embed.addFields({ name: combatant(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.maxHp, 16)} ${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
				})
				break;
		}
		embed.setTitle(`${delver.predict} ${infoForNextRound ? "Predictions for" : "State of"} Round ${infoForNextRound ? adventure.room.round + 1 : adventure.room.round}`);
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	}
);
