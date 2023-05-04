const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const Command = require('../../Classes/Command.js');

const id = "commands";
const options = [];
module.exports = new Command(id, "List PotL's slash commands", false, false, options);

let wikiPage;
fs.readFile("Wiki/Commands.md", { encoding: "utf-8" }, (error, data) => {
	if (error) {
		console.error(error);
	} else {
		wikiPage = data;
	}
})

module.exports.execute = (interaction) => {
	let embed = new EmbedBuilder().setColor("#6b81eb")
		.setAuthor({
			name: "Click here to visit the PotL GitHub",
			iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
			url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth"
		})
		.setTitle("Prophets of the Labyrinth's Slash Commands")
		.setDescription("Here are the slash commands available on this bot:")
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
		.setFooter({ text: "Use /support to learn how to support the game!", iconURL: interaction.client.user.displayAvatarURL() })
		.setTimestamp();
	let totalCharacterCount = embed.author.name.length + embed.title.length + embed.description.length + embed.footer.text.length;

	let files;
	for (const commandSet of wikiPage.split("\n## ")) {
		let commands = commandSet.split("\n### ");
		let [commandSetName, commandSetText] = commands[0].split(/\r*\n/);
		if (commandSetName.startsWith("## ")) {
			commandSetName = commandSetName.slice(2);
		}
		commandSetText = `*${commandSetText.trim()}*`;
		for (const command of commands.slice(1)) {
			let [commandName, description, ...args] = command.split(/\r*\n/)
			commandSetText += `\n__${commandName}__ ${description}`;
		}

		totalCharacterCount += commandSetName.length + commandSetText.length;
		if (commandSetText.length > 1024 || totalCharacterCount > 6000) {
			files = [{
				attachment: "Wiki/Commands.md",
				name: "commands.txt"
			}];
			break;
		} else {
			embed.addFields({ name: commandSetName, value: commandSetText });
		}
	}
	if (files) {
		interaction.reply({ files, ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	}
}
