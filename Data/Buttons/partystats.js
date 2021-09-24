const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureList.js');

module.exports = new Button("partystats");

module.exports.execute = (interaction, args) => {
	// Show user the party stats
	let adventure = getAdventure(interaction.channel.id);
	let embed = new MessageEmbed()
		.setTitle("Party Stats")
		.setDescription(`${adventure.name} - Depth: ${adventure.depth}`)
		.addField(`${adventure.lives} Lives Remain`, "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end.")
		.addField(`${adventure.gold} Gold`, "Gold is exchanged for goods and services within adventures. Gold *will be lost when an adventure ends*.")
        .setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png");
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
