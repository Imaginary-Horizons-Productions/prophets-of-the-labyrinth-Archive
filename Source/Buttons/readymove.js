const Button = require('../../Classes/Button.js');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Delver = require('../../Classes/Delver.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getEmoji, getWeakness, getColor } = require('../elementHelpers.js');
const { getAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { equipmentToEmbedField } = require('../equipmentDAO.js');
const { generateTextBar } = require('../../helpers.js');

const customId = "readymove";
module.exports = new Button(customId,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		if (delver.getModifierStacks("Stun") > 0) { // Early out if stunned
			interaction.reply({ content: "You cannot pick a move because you are stunned this round.", ephemeral: true });
			return;
		}
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.element))
			.setTitle("Readying a Move")
			.setDescription(`Your ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.\n\nPick one option from below as your move for this round:`)
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
		const enemyOptions = [];
		for (let i = 0; i < adventure.room.enemies.length; i++) {
			let enemy = adventure.room.enemies[i];
			if (enemy.hp > 0) {
				enemyOptions.push({
					label: enemy.getName(adventure.room.enemyIdMap),
					description: miniPredict(delver.predict, enemy),
					value: `enemy${SAFE_DELIMITER}${i}`
				})
			}
		}
		let delverOptions = adventure.delvers.map((ally, i) => {
			return {
				label: ally.name,
				description: miniPredict(delver.predict, ally),
				value: `delver${SAFE_DELIMITER}${i}`
			}
		});
		const components = [];
		const usableMoves = delver.equipment.filter(equip => equip.uses > 0);
		if (usableMoves.length < adventure.getEquipmentCapacity()) {
			usableMoves.unshift({ name: "Punch", uses: Infinity });
		}
		for (let i = 0; i < usableMoves.length; i++) {
			const { name: equipName, uses } = usableMoves[i];
			embed.addFields(equipmentToEmbedField(equipName, uses));
			const { target, team } = getEquipmentProperty(equipName, "targetingTags");
			const elementEmoji = getEmoji(getEquipmentProperty(equipName, "element"));
			if (target === "single") {
				// Select Menu
				let targetOptions = [];
				if (team === "enemy" || team === "any") {
					targetOptions = targetOptions.concat(enemyOptions);
				}

				if (team === "delver" || team === "any") {
					targetOptions = targetOptions.concat(delverOptions);
				}
				components.push(new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`movetarget${SAFE_DELIMITER}${equipName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
						.setPlaceholder(`${elementEmoji} Use ${equipName} on...`)
						.addOptions(targetOptions)
				));
			} else {
				// Button
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`confirmmove${SAFE_DELIMITER}${equipName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
						.setLabel(`Use ${equipName}`)
						.setEmoji(elementEmoji)
						.setStyle(ButtonStyle.Secondary)
				));
			}
		}
		interaction.reply({ embeds: [embed], components, ephemeral: true })
			.catch(console.error);
	}
);

function miniPredict(predictType, combatant) {
	switch (predictType) {
		case "Movements":
			const staggerCount = combatant.getModifierStacks("Stagger");
			return `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}`;
		case "Vulnerabilities":
			return `Weakness: ${getEmoji(getWeakness(combatant.element))}`;
		case "Intents":
			if (combatant instanceof Delver) {
				return "Move in 2 rounds: Ask them";
			} else {
				return `Move in 2 rounds: ${combatant.nextAction}`;
			}
		case "Health":
			return `HP: ${combatant.hp}/${combatant.maxHp}`;
	}
}
