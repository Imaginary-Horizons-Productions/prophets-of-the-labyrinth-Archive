const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const Resource = require('../../Classes/Resource.js');
const { removeModifier, getFullName } = require('../combatantDAO.js');
const { rollConsumable } = require('../labyrinths/_labyrinthDictionary');

module.exports = new EquipmentTemplate("Urgent Potion Kit", "*Add 1 random potion to loot with priority*\nCritical Hit: +@{critBonus} potion", "Water", effect, [])
.setCategory("Trinket")
.setTargetingTags({ target: "self", team: "delver" })
.setModifiers([{ name: "Stagger", stacks: 1 }])
.setCost(200)
.setUses(10)
.markPriority();

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollConsumable(adventure, "Potion");
	if (isCrit) {
		adventure.addResource(new Resource(randomPotion, "consumable", 2, "loot", 0));
		return `${getFullName(user, adventure.room.enemyTitles)} sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
		return `${getFullName(user, adventure.room.enemyTitles)} sets a batch of ${randomPotion} simmering.`;
	}
}
