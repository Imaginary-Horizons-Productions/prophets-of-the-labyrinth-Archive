const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureList.js');

module.exports = new Button("read");

module.exports.execute = (interaction, args) => {
	// Based on type, show the user information on the next battle round in an ephemeral message
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle("Reading the Situation");
	switch (delver.readType) {
		case "targets": // Shows who the enemies are targeting next round
			let targetText = "__Enemy Targets__";
			adventure.battleMoves.forEach(move => {
				if (move.userTeam === "enemy") {
					let enemy = adventure.battleEnemies[move.userIndex];
					let target = adventure.delvers[move.targetIndex];
					targetText += `\nNext round, **${enemy.name}** intends to attack **${target.name}**`;
				}
			})
			embed.setDescription(targetText);
			break;
		case "crits": // Shows which characters are going to critically hit next round
			embed.setDescription("Coming Soon!");
			break;
		case "health": // Shows current HP, max HP, and elemental weakness of all characters
			embed.setDescription("Coming Soon!");
			break;
		case "speed": // Shows roundly random speed bonuses and order of move resolution
			let speedText = "__Move Order__";
			let combatants = adventure.battleEnemies.concat(adventure.delvers).sort((first, second) => {
				return second.speed - first.speed;
			});
			for (let i = 0; i < combatants.length; i++) {
				speedText += `\n${i + 1}: ${combatants[i].name} (${combatants[i].roundSpeed >= 0 ? `+${combatants[i].roundSpeed}` : `${combatants[i].roundSpeed}`} speed)`
			}
			embed.setDescription(speedText);
			break;
		case "stagger": // Shows current pressure and stagger thresholds for all characters
			embed.setDescription("Coming Soon!");
			break;
	}
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.log)
}
