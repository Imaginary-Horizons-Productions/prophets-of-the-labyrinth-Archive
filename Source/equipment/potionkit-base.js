const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const Resource = require('../../Classes/Resource.js');
const { generateRandomNumber } = require('../../helpers.js');
const { removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Potion Kit", "Add 1 random potion to loot", "Instead add @{critBonus} potions", "Water", effect)
	.setCategory("Trinket")
	.setTargetingTags({ target: "none", team: "none" })
	.setUpgrades("Guarding Potion Kit", "Organic Potion Kit", "Urgent Potion Kit")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10);

const rollablePotions = [
	"Block Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Health Potion",
	"Watery Potion",
	"Windy Potion"
];

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	const randomPotion = rollablePotions[generateRandomNumber(adventure, rollablePotions.length, "battle")];
	if (isCrit) {
		adventure.addResource(new Resource(randomPotion, "consumable", critBonus, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
	} else {
		adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
		return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
	}
}
