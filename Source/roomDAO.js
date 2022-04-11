const { MessageActionRow } = require("discord.js");

/**
 * Modify the button with `customId` (from `message`'s components) based on `preventUse`, `emoji`, and `label` then return all components
 *
 * @param {Message} message
 * @param {string} customId
 * @param {boolean} preventUse
 * @param {string} [emoji]
 * @param {string} label
 * @returns {MessageActionRow[]} the components of the message with the button edited
 */
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

/**
 * Decrement the resource count on "forgeSupplies", update the count in the room's embed, and disable components if supplies are exhausted
 *
 * @param {Interaction} interaction
 * @param {string} roomMessageId
 * @param {Adventure} adventure
 * @returns {Promise<Message>}
 */
exports.decrementForgeSupplies = async function (interaction, roomMessageId, adventure) {
	adventure.room.resources.forgeSupplies.count--;
	const roomMessage = await interaction.channel.messages.fetch(roomMessageId)
	let { embeds } = roomMessage;
	embeds[0].spliceFields(roomEmbed.fields.findIndex(field => field.name === "Remaining Forge Supplies"), 1, { name: "Remaining Forge Supplies", value: adventure.room.resources.forgeSupplies.count.toString() })
	if (adventure.room.resources.forgeSupplies.count === 0) {
		return roomMessage.edit({
			embeds,
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
		return roomMessage.edit({ embeds });
	}
}
