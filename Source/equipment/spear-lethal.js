const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Lethal Spear", "Strike a foe for @{damage} @{element} damage", "Damage x@{critBonus}, also inflict @{mod1Stacks} @{mod1}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(100);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
		addModifier(target, critStagger);
	}
	return dealDamage([target], user, damage, false, element, adventure);
}
