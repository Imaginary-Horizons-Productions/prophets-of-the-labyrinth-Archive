const Consumable = require("../../Classes/ConsumableTemplate.js");
const { getFullName, gainHealth } = require("../combatantDAO.js");

module.exports = new Consumable("Vitamins", "Increases the user's max HP by 50.", effect)
	.setElement("Untyped")
	.setFlavorText([]);

function effect(user, adventure) {
	// +50 max hp
	const gains = 50;
	user.maxHp += gains;
	gainHealth(user, gains, adventure);
	return `${getFullName(user, adventure.room.enemyTitles)} quaffs the vitamins.`;
}
