const Equipment = require('../../Classes/Equipment.js');
const { removeModifier, addBlock, dealDamage } = require('../combatantDAO.js');

module.exports = new Equipment("Sweeping Blood Aegis", 2, "*Pay @{hpCost} hp to grant all allies @{block} block*\nCritical Hit: Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Heavy Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

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
