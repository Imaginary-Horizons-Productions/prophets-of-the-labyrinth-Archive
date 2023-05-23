const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Urgent Barrier", "*Grant an ally @{block} block with priority*\nCritical Hit💥: Block x@{critBonus}", "Fire", effect, ["Purifiying Barrier", "Thick Barrier"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(1)
	.setBlock(1000)
	.markPriority();

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return ""; // result as text
}
