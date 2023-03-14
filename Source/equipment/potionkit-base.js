const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, getFullName } = require('../combatantDAO.js');
const { rollConsumable } = require('../labyrinths/_labyrinthDictionary');

module.exports = new EquipmentTemplate("Potion Kit", "*Add 1 random potion to loot*\nCritical Hit💥: add @{critBonus} potions instead", "Water", effect, ["Guarding Potion Kit", "Urgent Potion Kit"])
.setCategory("Trinket")
.setTargetingTags({ target: "none", team: "none" })
.setModifiers([{ name: "Stagger", stacks: 1 }])
.setCost(200)
.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollConsumable(adventure, "Potion");
	if (isCrit) {
		adventure.addResource(randomPotion, "consumable", 2, "loot", 0);
		return `${getFullName(user, adventure.room.enemyTitles)} sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(randomPotion, "consumable", 1, "loot", 0);
		return `${getFullName(user, adventure.room.enemyTitles)} sets a batch of ${randomPotion} simmering.`;
	}
}
