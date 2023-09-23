const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Spear", "Strike a foe for @{damage} @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(15)
	.setDamage(100);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage([target], user, damage, false, element, adventure);
}
