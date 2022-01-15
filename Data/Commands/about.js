const Command = require('./../../Classes/Command.js');
const { MessageEmbed } = require("discord.js");

module.exports = new Command("about", "Get Dungeon Tamer's description and contributors", false, false);

module.exports.execute = (interaction) => {
	// Give the basic rules and information about the bot
	let embed = new MessageEmbed().setColor('6b81eb')
		.setTitle(`About Dungeon Tamers v0.3.1`)
		// .setURL(/* bot invite link */)
		.setThumbnail(interaction.client.user.displayAvatarURL())
		.setDescription(`A roguelike dungeon crawl in Discord to play with other server members.`)
		.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Arcane_ish) )`)
		.addField("Random Number Generator", "Alex Frank")
		.addField("Room Loader", "Michel Momeyer")
		.addField("Predict Balance", "Lucas Ensign")
		.addField("Playtesting", "Henry Hu, Ralph Beishline, Eric Hu, elrois, Jon Puddicombe")
		.addField(`Embed Thumbnails`, `[game-icons.net](https://game-icons.net/)`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });

	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error)
}
