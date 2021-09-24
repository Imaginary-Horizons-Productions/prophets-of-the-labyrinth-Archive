const Button = require('../../Classes/Button.js');
const { MessageEmbed } = require('discord.js');
const { getAdventure } = require('../adventureList.js');

module.exports = new Button("self");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let embed = new MessageEmbed()
		.setTitle(delver.name)
		.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nReads: ${delver.readType}`)
		.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png");
	for (let i = 0; i < delver.weapons.length; i++) {
		let weapon = delver.weapons[i];
		embed.addField(`Weapon ${i + 1}: ${weapon.name}`, `Uses: ${weapon.uses}/${weapon.maxUses}\nElement: ${weapon.element}\n${weapon.description}`);
	}
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
