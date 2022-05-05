const Equipment = require('../../Classes/Equipment.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Barrier", 1, "*Grant an ally @{block} block*\nCritical Hit: Block x@{critBonus}", "Light", effect, ["Purifiying Barrier", "Thick Barrier", "Urgent Barrier"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(1)
	.setBlock(1000);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return "";
}
