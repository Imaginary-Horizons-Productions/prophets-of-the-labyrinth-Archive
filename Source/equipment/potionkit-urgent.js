const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const Resource = require('../../Classes/Resource.js');
const { removeModifier } = require('../combatantDAO.js');
const { rollConsumable } = require('../labyrinths/_labyrinthDictionary');

module.exports = new EquipmentTemplate("Urgent Potion Kit", "Add 1 random potion to loot with priority", "Instead add @{critBonus} potions", "Water", effect, ["Guarding Potion Kit", "Organic Potion Kit"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "none", team: "none" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.markPriority();

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollConsumable(adventure, "Potion");
	if (isCrit) {
		adventure.addResource(new Resource(randomPotion, "consumable", critBonus, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
	}
}
