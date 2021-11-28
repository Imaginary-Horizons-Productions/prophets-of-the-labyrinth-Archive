const { MessageActionRow } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');

module.exports = new Button("takegold");

module.exports.execute = (interaction, args) => {
	// Move the gold and relics from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	adventure.gold += adventure.room.loot.gold;
	interaction.update({
		components: [...interaction.message.components.map(row => {
			return new MessageActionRow().addComponents(...row.components.map(component => {
				if (component.customId === "takegold") {
					return component.setDisabled(true)
						.setEmoji("✔️")
						.setLabel(`+${adventure.room.loot.gold} gold`);
				} else {
					return component;
				}
			}));
		})
		]
	});
	updateRoomHeader(adventure, interaction.message);
	adventure.room.loot.gold = 0;
	setAdventure(adventure);
}
