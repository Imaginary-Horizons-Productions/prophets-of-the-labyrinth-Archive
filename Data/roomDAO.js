const { MessageActionRow } = require("discord.js");

exports.editButton = function (message, customId, preventUse, emoji, label) {
	return message.components.map(row => {
		return new MessageActionRow().addComponents(...row.components.map(component => {
			if (component.customId === customId) {
				let editedButton = component.setDisabled(preventUse)
					.setLabel(label);
				if (emoji) {
					editedButton.setEmoji(emoji);
				}
				return editedButton;
			} else {
				return component;
			}
		}));
	})
}

exports.decrementForgeSupplies = function (interaction, roomMessageId, adventure) {
	adventure.room.loot.forgeSupplies--;
	return interaction.channel.messages.fetch(roomMessageId).then(roomMessage => {
		let roomEmbed = roomMessage.embeds[0];
		roomEmbed.spliceFields(roomEmbed.fields.findIndex(field => field.name === "Remaining Forge Supplies"), 1, { name: "Remaining Forge Supplies", value: adventure.room.loot.forgeSupplies.toString() })
		if (adventure.room.loot.forgeSupplies === 0) {
			return roomMessage.edit({
				embeds: [roomEmbed],
				components: [...roomMessage.components.map(row => {
					return new MessageActionRow().addComponents(...row.components.map(component => {
						if (component.customId === "upgrade" || component.customId === "repair") {
							let editedButton = component.setDisabled(true)
								.setEmoji("✔️");
							return editedButton;
						} else {
							return component;
						}
					}));
				})]
			})
		} else {
			return roomMessage.edit({ embeds: [roomEmbed] });
		}
	})
}
