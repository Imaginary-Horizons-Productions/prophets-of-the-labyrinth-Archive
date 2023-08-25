const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { renderRoom } = require("../roomDAO.js");

const customId = "buyconsumable";
module.exports = new Select(customId, (interaction, args) => {
	// Allow the party to buy a consumable at a merchant
	const adventure = getAdventure(interaction.channel.id);
	if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
		interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
		return;
	}

	const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
	const { count, cost } = adventure.room.resources[name];
	if (count < 1) {
		interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
		return;
	}

	if (adventure.gold < cost) {
		interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
		return;
	}

	adventure.gold -= cost;
	adventure.room.resources[name].count--;
	if (name in adventure.consumables) {
		adventure.consumables[name]++;
	} else {
		adventure.consumables[name] = 1;
	}
	interaction.message.edit(renderRoom(adventure, interaction.channel));
	interaction.reply({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
	setAdventure(adventure);
});
