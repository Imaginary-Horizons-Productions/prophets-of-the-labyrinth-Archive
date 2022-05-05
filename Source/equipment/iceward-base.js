const Equipment = require('../../Classes/Equipment.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Ice Ward", 1, "*Grant @{block} block to an ally and yourself*\nCritical Hit: Block x@{critBonus}", "Water", effect, ["Heavy Ice Ward", "Sweeping Ice Ward"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setBlock(50);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addBlock(user, block);
	return "";
}
