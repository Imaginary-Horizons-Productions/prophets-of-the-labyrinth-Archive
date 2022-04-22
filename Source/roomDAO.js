const { MessageActionRow } = require("discord.js");

/** Modify the buttons whose `customId`s are keys in `edits` from among `components` based on `preventUse`, `label`, and `emoji` then return all components
 * @param {MessageActionRow[]} components
 * @param {object} edits - customId as key to object with { preventUse, label, [emoji] }
 * @returns {MessageActionRow[]} the components of the message with the button edited
 */
exports.editButtons = function (components, edits) {
	return components.map(row => {
		return new MessageActionRow().addComponents(...row.components.map(component => {
			let customId = component.customId;
			if (customId in edits) {
				const { preventUse, label, emoji } = edits[customId];
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

/** Decrement the resource count on "forgeSupplies", update the count in the room's embed, and disable components if supplies are exhausted
 * @param {Interaction} interaction
 * @param {string} roomMessageId
 * @param {Room} room
 * @returns {Promise<Message>}
 */
exports.decrementForgeSupplies = async function (interaction, roomMessageId, room) {
	room.resources.forgeSupplies.count--;
	const roomMessage = await interaction.channel.messages.fetch(roomMessageId)
	let { embeds } = roomMessage;
	embeds[0].spliceFields(embeds[0].fields.findIndex(field => field.name === "Remaining Forge Supplies"), 1, { name: "Remaining Forge Supplies", value: room.resources.forgeSupplies.count.toString() })
	if (room.resources.forgeSupplies.count === 0) {
		return roomMessage.edit({
			embeds,
			components: exports.editButtons(roomMessage.components, {
				"upgrade": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" },
				"repair": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" }
			})
		})
	} else {
		return roomMessage.edit({ embeds });
	}
}
