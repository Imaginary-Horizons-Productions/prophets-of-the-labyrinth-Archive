const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Vigilant Scutum", "Grant @{block} block to an ally and yourself and gain @{mod1Stacks} @{mod1}", "Block x@{critBonus}", "Fire", effect)
	.setCategory("Armor")
	.setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Heavy Scutum", "Sweeping Scutum")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addBlock(user, block);
	addModifier(user, vigilance);
	const userName = user.getName(adventure.room.enemyIdMap);
	return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${userName}. ${userName} gains Vigilance.`;
}
