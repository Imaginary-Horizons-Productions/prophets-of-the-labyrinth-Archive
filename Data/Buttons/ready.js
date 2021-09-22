const { getAdventure, nextRoom } = require('../adventureList.js');
const Button = require('../../Classes/Button.js');
const { getGuild } = require('../guildList.js');
const { weaponDictionary } = require("./../Weapons/_weaponDictionary.js");

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
		adventure.delvers.forEach(delver => { //TODO move to select to generate delvers based on character picks
			delver.weapons.push(weaponDictionary["dagger"]);
		})
		interaction.reply({ content: `The adventure has begun!.`, ephemeral: true });
		nextRoom(adventure, interaction.channel);
	}
}
