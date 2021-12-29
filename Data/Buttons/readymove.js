const Button = require('../../Classes/Button.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { getAdventure } = require('../adventureDAO.js');
const { getFullName, modifiersToString } = require("../combatantDAO.js");
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');
const { weaponToEmbedField } = require('../weaponDAO.js');

module.exports = new Button("readymove");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user and provide components to ready a move
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		if (!delver.modifiers.Stun) { // Early out if stunned
			let embed = new MessageEmbed().setColor(adventure.room.embedColor)
				.setTitle(getFullName(delver, adventure.room.enemyTitles))
				.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nElement: ${delver.element}`)
				.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });

			let modifiersText = modifiersToString(delver);
			if (modifiersText !== "") {
				embed.addField("Modifiers", modifiersText);
			}

			let moveMenu = [];
			let enemyOptions = [];
			for (let i = 0; i < adventure.room.enemies.length; i++) {
				let enemy = adventure.room.enemies[i];
				if (enemy.hp > 0) {
					enemyOptions.push({ label: getFullName(enemy, adventure.room.enemyTitles), description: "", value: `enemy-${i}` })
				}
			}
			let allyOptions = adventure.delvers.map((ally, i) => {
				return {
					label: ally.name,
					description: "", //TODO #137 predict reminder in move target select
					value: `ally-${i}`
				}
			})
			let usableWeapons = delver.weapons.filter(weapon => weapon.uses > 0);
			if (usableWeapons.length > 0) {
				for (const weapon of usableWeapons) {
					embed.addField(...weaponToEmbedField(weapon.name, weapon.uses));
					let { target, team } = getWeaponProperty(weapon.name, "targetingTags");
					if (target === "single") {
						// Select Menu
						let targetOptions = [];
						if (team === "enemy" || team === "any") {
							targetOptions = targetOptions.concat(enemyOptions);
						}

						if (team === "ally" || team === "any") {
							targetOptions = targetOptions.concat(allyOptions);
						}
						moveMenu.push(new MessageActionRow().addComponents(
							new MessageSelectMenu().setCustomId(`weapon-${weapon.name}`)
								.setPlaceholder(`Use ${weapon.name} on...`)
								.addOptions(targetOptions)
						));
					} else {
						// Button
						moveMenu.push(new MessageActionRow().addComponents(
							new MessageButton().setCustomId(`nontargetweapon-${weapon.name}`)
								.setLabel(`Use ${weapon.name}`)
								.setStyle("PRIMARY")
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
