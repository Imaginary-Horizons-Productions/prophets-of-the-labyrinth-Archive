const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Charging Blood Aegis", "*Pay @{hpCost} hp to grant an ally @{block} block, then gain @{mod1Stacks} @{mod1}*\nCritical Hit: Block x@{critBonus}", "Water", effect, ["Heavy Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addModifier(user, powerUp);
	return dealDamage(user, null, hpCost, true, "Untyped", adventure); // user pays health
}
