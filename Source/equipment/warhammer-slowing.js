const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Slowing Warhammer", "Strike a foe for @{damage} (+@{bonus} if foe is already stunned) @{element} damage and inflict @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Piercing Warhammer")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, slow], damage, bonus, critBonus } = module.exports;

	if (target.getModifierStacks("Stun") > 0) {
		damage += bonus;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, slow);
	return dealDamage([target], user, damage, false, element, adventure);
}
