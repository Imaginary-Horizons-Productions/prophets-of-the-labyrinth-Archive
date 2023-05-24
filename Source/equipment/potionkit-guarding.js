const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const Resource = require('../../Classes/Resource.js');
const { removeModifier, getFullName, addBlock } = require('../combatantDAO.js');
const { rollConsumable } = require('../labyrinths/_labyrinthDictionary');

module.exports = new EquipmentTemplate("Guarding Potion Kit", "Gain @{block} block and add 1 random potion to loot", "Instead add @{critBonus} potions", "Water", effect, ["Urgent Potion Kit"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "none", team: "none" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setBlock(75);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollConsumable(adventure, "Potion");
	addBlock(user, block);
	if (isCrit) {
		adventure.addResource(new Resource(randomPotion, "consumable", 2, "loot", 0));
		return `${getFullName(user, adventure.room.enemyTitles)} hunkers down and sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
		return `${getFullName(user, adventure.room.enemyTitles)} hunkers down and sets a batch of ${randomPotion} simmering.`;
	}
}
