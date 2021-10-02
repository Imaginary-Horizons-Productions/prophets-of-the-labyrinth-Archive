const { getAdventure, nextRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const Weapon = require('../../Classes/Weapon.js');
const { getGuild } = require('../guildDAO.js');
const { weaponDictionary } = require("./../Weapons/_weaponDictionary.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Button("ready");

module.exports.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	if (interaction.user.id === args[2]) {
		let adventure = getAdventure(args[1]);
		let guildProfile = getGuild(interaction.guild.id);
		interaction.guild.channels.fetch(guildProfile.centralId).then(channel => {
			channel.messages.fetch(adventure.startMessageId).then(startMessage => {
				startMessage.edit({ components: [] });
			})
		}).catch(console.error);
		interaction.message.edit({ components: [] })
			.catch(console.error);
		adventure.lives = adventure.delvers.length + 1;
		adventure.delvers.forEach(delver => { //TODO #15 move to select to generate delvers based on character picks
			delver.weapons.push(Object.assign(new Weapon(), weaponDictionary["dagger"]), Object.assign(new Weapon(), weaponDictionary["buckler"]));
			while (delver.weapons.length < 5) {
				delver.weapons.push(Object.assign(new Weapon(), weaponDictionary["empty"]));
			}
		})
		let utilities = [new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("self")
					.setLabel("Inspect self")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("partystats")
					.setLabel("Party Stats")
					.setStyle("SECONDARY")
			)];
		interaction.reply({ content: `The adventure has begun! Here are some utilities for the run (remember to \`Jump\` to the message if viewing from pins).`, components: utilities, fetchReply: true }).then(message => {
			message.pin();
			adventure.utilityMessageId = message.id;
		});
		nextRoom(adventure, interaction.channel);
	}
}
