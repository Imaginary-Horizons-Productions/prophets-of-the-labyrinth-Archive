const { EmbedBuilder } = require('discord.js');
const Command = require('../../Classes/Command.js');

const id = "support";
const options = [];
module.exports = new Command(id, "List ways to support PotL", false, false, options);

module.exports.execute = (interaction) => {
	interaction.reply({
		embeds: [
			new EmbedBuilder().setColor("#6b81eb")
				.setAuthor({
					name: "Click here to visit the PotL GitHub",
					iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
					url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth"
				})
				.setTitle(`Supporting Prophets of the Labyrinth`)
				.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
				.setDescription("Thanks for playing *Prophets of the Labyrinth*. Here are a few ways to support us:")
				.addFields({ name: "Check out the github", value: "Check out our [github](https://github.com/Imaginary-Horizons-Productions) and tackle some issues or sponsor a project!" })
				.setFooter({ text: "Thanks in advanced!", iconURL: interaction.client.user.displayAvatarURL() })
				.setTimestamp()
		],
		ephemeral: true
	})
}
