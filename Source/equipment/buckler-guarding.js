const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Guarding Buckler", "Grant @{block} block to an ally and yourself and gain @{mod1Stacks} @{mod1}", "Block x@{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Armor")
	.setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Devoted Buckler", "Heavy Buckler")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(15)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addBlock(user, block);
	addModifier(user, powerUp);
	const userName = user.getName(adventure.room.enemyIdMap);
	return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)} and ${userName}. ${userName} is Powered Up.`;
}
