const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Bow", "Strike a foe for @{damage} @{element} damage with priority", "Damage x@{critBonus}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Evasive Bow", "Hunter's Bow", "Mercurial Bow")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(15)
	.setDamage(75)
	.setPriority(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage([target], user, damage, false, element, adventure);
}
