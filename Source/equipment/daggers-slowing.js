const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Slowing Daggers", "Strike a foe for @{damage} @{element} damage and inflict @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Sharpened Daggers", "Sweeping Daggers")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setCritBonus(3)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, slow], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, slow);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	});
}
