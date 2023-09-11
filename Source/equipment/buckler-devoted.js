const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Devoted Buckler", "Grant an ally @{block} block and @{mod1Stacks} @{mod1}", "Block x@{critBonus}", "Earth", effect)
	.setCategory("Armor")
	.setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Guarding Buckler", "Heavy Buckler")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addModifier(target, powerUp);
	const targetName = target.getName(adventure.room.enemyIdMap);
	return `Damage will be Blocked for ${targetName}. ${user.getName(adventure.room.enemyIdMap)} and ${targetName} are Powered Up.`;
}
