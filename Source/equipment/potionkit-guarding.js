const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const Resource = require('../../Classes/Resource.js');
const { generateRandomNumber } = require('../../helpers.js');
const { removeModifier, addBlock } = require('../combatantDAO.js');

const rollablePotions = [
	"Block Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Health Potion",
	"Watery Potion",
	"Windy Potion"
];

module.exports = new EquipmentTemplate("Guarding Potion Kit", "Gain @{block} block and add 1 random potion to loot", "Instead add @{critBonus} potions", "Water", effect)
	.setCategory("Trinket")
	.setTargetingTags({ target: "none", team: "none" })
	.setSidegrades("Organic Potion Kit", "Urgent Potion Kit")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setBlock(75)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollablePotions[generateRandomNumber(adventure, rollablePotions.length, "battle")];
	addBlock(user, block);
	if (isCrit) {
		adventure.addResource(new Resource(randomPotion, "consumable", critBonus, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a batch of ${randomPotion} simmering.`;
	}
}
