const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Blood Aegis", "Pay @{hpCost} hp to grant an ally @{block} block", "Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Heavy Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return payHP(user, hpCost, adventure);
}
