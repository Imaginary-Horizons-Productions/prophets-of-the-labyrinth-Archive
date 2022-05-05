const Equipment = require('../../Classes/Equipment.js');
const { removeModifier, addBlock, dealDamage } = require('../combatantDAO.js');

module.exports = new Equipment("Blood Aegis", 1, "*Pay @{hpCost} hp to grant an ally @{block} block*\nCritical Hit: Block x@{critBonus}", "Darkness", effect, ["Charging Blood Aegis", "Heavy Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return dealDamage(user, null, hpCost, true, "Untyped", adventure); // user pays health
}
