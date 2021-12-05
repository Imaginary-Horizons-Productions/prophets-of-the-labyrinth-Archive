const Button = require('../../Classes/Button.js');
const { MessageEmbed } = require('discord.js');
const { getAdventure } = require('../adventureDAO.js');
const { weaponToEmbedField } = require('../weaponDAO.js');
const { getFullName } = require('../combatantDAO.js');

module.exports = new Button("self");

module.exports.execute = (interaction, args) => {
	// Show the delver stats of the user
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		let embed = new MessageEmbed()
			.setTitle(getFullName(delver, adventure.room.enemyTitles))
			.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nPredicts: ${delver.predict}\nElement: ${delver.element}`)
			.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png");
		for (let weaponName in delver.weapons) {
			embed.addField(...weaponToEmbedField(weaponName, delver.weapons[weaponName]));
		}
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ content: "You are not a part of this adventure.", ephemeral: true });
	}
}
