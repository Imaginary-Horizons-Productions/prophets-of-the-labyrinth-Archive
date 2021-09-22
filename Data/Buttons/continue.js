const { nextRoom, getAdventure } = require('../adventureList.js');
const Button = require('../../Classes/Button.js');

module.exports = new Button("continue");

module.exports.execute = (interaction, args) => {
    // Generate the next room of an adventure
    let adventure = getAdventure(interaction.channel.id);
    interaction.message.edit({ components: [] })
        .catch(console.error);
    interaction.reply(nextRoom(adventure, interaction.channel)).then(message => {
		adventure.lastComponentMessageId = message.id;
	});
}
