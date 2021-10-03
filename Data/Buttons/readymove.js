const Button = require('../../Classes/Button.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { getAdventure } = require('../adventureDAO.js');
const { getFullName } = require("../combatantDAO.js");

module.exports = new Button("readymove");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user and provide components to ready a move
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle(delver.name)
		.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nReads: ${delver.readType}`)
		.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png");

	let moveMenu = [];
	let enemyOptions = adventure.battleEnemies.map((enemy, i) => {
		return {
			label: getFullName(enemy, adventure.battleEnemyTitles),
			description: "",
			value: `enemy-${i}`
		}
	})
	let allyOptions = adventure.delvers.map((ally, i) => {
		return {
			label: ally.name,
			description: "",
			value: `ally-${i}`
		}
	})
	if (delver.weapons.length > 0) {
		for (let i = 0; i < delver.weapons.length; i++) {
			let weapon = delver.weapons[i];
			embed.addField(`${weapon.name}`, `Uses: ${weapon.uses}/${weapon.maxUses}\nElement: ${weapon.element}\n${weapon.description}`);
			if (weapon.targetingTags.target === "single") {
				// Select Menu
				let targetOptions = [];
				if (weapon.targetingTags.team === "enemy" || weapon.targetingTags.team === "any") {
					targetOptions = targetOptions.concat(enemyOptions);
				}

				if (weapon.targetingTags.team === "ally" || weapon.targetingTags.team === "any") {
					targetOptions = targetOptions.concat(allyOptions);
				}
				moveMenu.push(new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId(`weapon-${i}`)
							.setPlaceholder(`Use ${weapon.name} on...`)
							.addOptions(targetOptions)
					));
			} else {
				// Button
				moveMenu.push(new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`weapon-${i}`)
							.setLabel(`Use ${weapon.name}`)
							.setStyle("SECONDARY")
					))
			}
		}
	} else {
		// Default move is Punch
		moveMenu.push(new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`weapon-punch`)
					.setPlaceholder(`Use Punch on...`)
					.addOptions(enemyOptions)
			));
	}
	interaction.reply({ embeds: [embed], components: moveMenu, ephemeral: true })
		.catch(console.error);
}
