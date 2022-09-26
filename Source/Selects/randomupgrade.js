const { Interaction } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { editButtons } = require('../roomDAO.js');

const id = "randomupgrade";
module.exports = new Select(id,
	/** Randomly select an upgrade for a given piece of equipment
	 * @param {Interaction} interaction
	 * @param {Array<string>} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (adventure.room.resources.roomActions.count > 0) {
			const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const [equipmentName, index] = interaction.values[0].split(SAFE_DELIMITER);
			const upgradePool = getEquipmentProperty(equipmentName, "upgrades");
			const upgradeName = upgradePool[generateRandomNumber(adventure, upgradePool.length, "general")];
			const upgradeUses = getEquipmentProperty(upgradeName, "maxUses");
			const usesDifference = upgradeUses - getEquipmentProperty(equipmentName, "maxUses");
			if (usesDifference > 0) {
				user.equipment[index].uses += usesDifference;
			}
			user.equipment.splice(index, 1, { name: upgradeName, uses: Math.min(upgradeUses, user.equipment[index].uses) });
			const remainingActions = --adventure.room.resources.roomActions.count;
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				const embeds = roomMessage.embeds.map(embed =>
					embed.spliceFields(embed.fields.findIndex(field => field.name === "Room Actions"), 1, { name: "Room Actions", value: remainingActions.toString() })
				);
				let components = roomMessage.components;
				if (remainingActions < 1) {
					components = editButtons(components, {
						"upgrade": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" },
						"viewrepairs": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" }
					})
				}
				return roomMessage.edit({ embeds, components });
			}).then(() => {
				interaction.update({ components: [] });
				interaction.channel.send(`${interaction.user}'s *${equipmentName}* has been upgraded to **${upgradeName}**!`);
				setAdventure(adventure);
			})
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	});
