const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editButtons } = require('../roomDAO.js');

const customId = "freerepairkit";
module.exports = new Button(customId,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources["Repair Kit"].count > 0) {
			if ("Repair Kit" in adventure.consumables) {
				adventure.consumables["Repair Kit"]++;
			} else {
				adventure.consumables["Repair Kit"] = 1;
			}
			adventure.room.resources["Repair Kit"].count = 0;
		}
		interaction.update({
			components: editButtons(interaction.message.components, { [customId]: { preventUse: true, label: "Repair Kit Acquired", emoji: "✔️" } })
		}).then(() => {
			setAdventure(adventure);
		});
	}
);
