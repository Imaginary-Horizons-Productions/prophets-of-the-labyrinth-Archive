const Button = require('../../Classes/Button.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { getAdventure } = require('../adventureDAO.js');
const { getFullName } = require("../combatantDAO.js");
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');
const { weaponToEmbedField } = require('../weaponDAO.js');
const { getEmoji, getResistances, getWeaknesses, getColor } = require('../elementHelpers.js');
const Delver = require('../../Classes/Delver.js');
const { isNonStacking, isBuff, isDebuff } = require("../Modifiers/_modifierDictionary.js");

module.exports = new Button("readymove");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user and provide components to ready a move
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		if (!delver.modifiers.Stun) { // Early out if stunned
			let embed = new MessageEmbed().setColor(getColor(adventure.room.element))
				.setTitle(getFullName(delver, adventure.room.enemyTitles))
				.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nWhen using ${delver.element} ${getEmoji(delver.element)} weapons, add 1 Stagger to enemies or remove 1 Stagger from allies`)
				.addField("Readying a Move", "Pick one weapon from below as your move for this round:")
				.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });

			let moveMenu = [];
			if (Object.keys(delver.modifiers).length) {
				moveMenu.push(new MessageActionRow().addComponents(...modifiersToActionRow(delver)));
			}
			let enemyOptions = [];
			for (let i = 0; i < adventure.room.enemies.length; i++) {
				let enemy = adventure.room.enemies[i];
				if (enemy.hp > 0) {
					enemyOptions.push({
						label: getFullName(enemy, adventure.room.enemyTitles),
						description: miniPredict(delver.predict, enemy),
						value: `enemy-${i}`
					})
				}
			}
			let delverOptions = adventure.delvers.map((delver, i) => {
				return {
					label: delver.name,
					description: miniPredict(delver.predict, delver),
					value: `delver-${i}`
				}
			})
			let usableWeapons = delver.weapons.filter(weapon => weapon.uses > 0);
			if (usableWeapons.length > 0) {
				for (let i = 0; i < usableWeapons.length; i++) {
					const weapon = usableWeapons[i];
					let elementEmoji = getEmoji(getWeaponProperty(weapon.name, "element"));
					embed.addField(...weaponToEmbedField(weapon.name, weapon.uses));
					let { target, team } = getWeaponProperty(weapon.name, "targetingTags");
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
							new MessageSelectMenu().setCustomId(`weapon-${weapon.name}-${i}`)
								.setPlaceholder(`${elementEmoji} Use ${weapon.name} on...`)
								.addOptions(targetOptions)
						));
					} else {
						// Button
						moveMenu.push(new MessageActionRow().addComponents(
							new MessageButton().setCustomId(`nontargetweapon-${weapon.name}-${i}`)
								.setLabel(`Use ${weapon.name}`)
								.setEmoji(elementEmoji)
								.setStyle("SECONDARY")
						))
					}
				}
			} else {
				// Default move is Punch
				moveMenu.push(new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId(`weapon-Punch`)
							.setPlaceholder(`Use Punch on...`)
							.addOptions(enemyOptions)
					));
			}
			interaction.reply({ embeds: [embed], components: moveMenu, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: "You cannot pick a weapon because you are stunned this round.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please participate in combat in adventures you've joined.", ephemeral: true });
	}
}

function miniPredict(predictType, combatant) {
	switch (predictType) {
		case "Targets":
			return `Resistances: ${getResistances(combatant.element).map(element => getEmoji(element)).join(" ")}`;
		case "Critical Hits":
			return `Weaknesses: ${getWeaknesses(combatant.element).map(element => getEmoji(element)).join(" ")}`;
		case "Health":
			return `HP: ${combatant.hp}/${combatant.maxHp}`;
		case "Move Order":
			return `Speed Bonus: ${combatant.roundSpeed >= 0 ? "+" : ""}${combatant.roundSpeed + combatant.actionSpeed}`;
		case "Modifiers":
			let staggerCount = combatant.modifiers.Stagger || 0;
			let bar = "";
			for (let i = 0; i < combatant.staggerThreshold; i++) {
				if (staggerCount > i) {
					bar += "▰";
				} else {
					bar += "▱";
				}
			}
			return `Stagger: ${bar}`;
		case "Enemy Moves":
			if (combatant instanceof Delver) {
				return "Move in 2 rounds: Ask them";
			} else {
				return `Move in 2 rounds: ${combatant.nextAction}`;
			}
	}
}

function modifiersToActionRow(combatant) {
	let actionRow = [];
	let modifiers = Object.keys(combatant.modifiers);
	let buttonCount = Math.min(modifiers.length, 4); // 5 buttons per row, save 1 spot for "and X more..." button
	for (let i = 0; i < buttonCount; i++) {
		let modifierName = modifiers[i];
		let style;
		if (isBuff(modifierName)) {
			style = "PRIMARY";
		} else if (isDebuff(modifierName)) {
			style = "DANGER";
		} else {
			style = "SECONDARY";
		}
		actionRow.push(new MessageButton().setCustomId(`modifier-${modifierName}-${i}`)
			.setLabel(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${combatant.modifiers[modifierName]}`}`)
			.setStyle(style))
	}
	if (modifiers.length > 4) {
		actionRow.push(new MessageButton().setCustomId(`modifier-MORE`)
			.setLabel(`${modifiers.length - 4} more...`)
			.setStyle("SECONDARY")
			.setDisabled(combatant.predict !== "Modifiers"))
	}
	return actionRow;
}
