const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Blood Aegis", "Pay @{hpCost} hp to grant all allies @{block} block", "Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Heavy Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (isCrit) {
		block *= critBonus;
	}
	targets.forEach(target => {
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addBlock(target, block);
	});
	return dealDamage(user, null, hpCost, true, "Untyped", adventure); // user pays health
}
