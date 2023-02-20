const Button = require('../../Classes/Button.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const Delver = require('../../Classes/Delver.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getEmoji, getWeakness, getColor } = require('../elementHelpers.js');
const { getAdventure } = require('../adventureDAO.js');
const { getFullName } = require("../combatantDAO.js");
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { equipmentToEmbedField } = require('../equipmentDAO.js');

const id = "readymove";
module.exports = new Button(id, (interaction, args) => {
	// Show the delver stats of the user and provide components to ready a move
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		if (delver.getModifierStacks("Stun") < 1) { // Early out if stunned
			let embed = new MessageEmbed().setColor(getColor(adventure.room.element))
				.setTitle("Readying a Move")
				.setDescription(`Your ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.\n\nPick one option from below as your move for this round:`)
				.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
			let enemyOptions = [];
			for (let i = 0; i < adventure.room.enemies.length; i++) {
				let enemy = adventure.room.enemies[i];
				if (enemy.hp > 0) {
					enemyOptions.push({
						label: getFullName(enemy, adventure.room.enemyTitles),
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
			})
			let moveMenu = [];
			let hasUsableWeapons = false;
			const usableMoves = delver.equipment.filter(equip => equip.uses > 0);
			for (let i = 0; i < usableMoves.length; i++) {
				const { name: equipName, uses } = usableMoves[i];
				if (!hasUsableWeapons && getEquipmentProperty(equipName, 'category') === 'Weapon') {
					hasUsableWeapons = true;
				}
				embed.addField(...equipmentToEmbedField(equipName, uses));
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
					moveMenu.push(new MessageActionRow().addComponents(
						new MessageSelectMenu().setCustomId(`movetarget${SAFE_DELIMITER}${equipName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
							.setPlaceholder(`${elementEmoji} Use ${equipName} on...`)
							.addOptions(targetOptions)
					));
				} else {
					// Button
					moveMenu.push(new MessageActionRow().addComponents(
						new MessageButton().setCustomId(`confirmmove${SAFE_DELIMITER}${equipName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
							.setLabel(`Use ${equipName}`)
							.setEmoji(elementEmoji)
							.setStyle("SECONDARY")
					))
				}
			}
			if (!hasUsableWeapons && moveMenu.length < adventure.getEquipmentCapacity()) {
				// Default move is Punch
				moveMenu = [
					new MessageActionRow({
						components: [
							new MessageSelectMenu(
								{
									customId: `movetarget${SAFE_DELIMITER}Punch${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}`,
									placeholder: 'Use Punch on...',
									options: enemyOptions
								}
							)
						]
					})
				].concat(moveMenu);
			}
			interaction.reply({ embeds: [embed], components: moveMenu, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: "You cannot pick a move because you are stunned this round.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please participate in combat in adventures you've joined.", ephemeral: true });
	}
});

function miniPredict(predictType, combatant) {
	switch (predictType) {
		case "Movements":
			let staggerCount = combatant.getModifierStacks("Stagger");
			let bar = "";
			for (let i = 0; i < combatant.staggerThreshold; i++) {
				if (staggerCount > i) {
					bar += "▰";
				} else {
					bar += "▱";
				}
			}
			return `Stagger: ${bar}`;
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
