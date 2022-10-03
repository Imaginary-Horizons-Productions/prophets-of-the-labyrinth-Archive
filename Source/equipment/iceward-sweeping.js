const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Ice Ward", "*Grant @{block} block to all allies (including yourself)*\nCritical Hit: Block x@{critBonus}", "Water", effect, ["Heavy Ice Ward"])
	.setCategory("Spell")
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
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
	addBlock(user, block / adventure.delvers.length); // effect is resolved once for each delver
	return "";
}
