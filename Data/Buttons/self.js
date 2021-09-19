const Button = require('../../Classes/Button.js');
const { MessageEmbed } = require('discord.js');
const { getAdventure } = require('../adventureList.js');

module.exports = new Button("self");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle(delver.characterName)
		.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nReads: ${delver.readType}`);
	for (let i = 0; i < delver.moves.length; i++) {
		embed.addField(`Move ${i + 1}: ${delver.moves[i].name}`, `Uses: ${delver.moves[i].uses}/${delver.moves[i].maxUses}`);
	}
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
