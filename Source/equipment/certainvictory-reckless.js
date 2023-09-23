const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, payHP } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Reckless Certain Victory", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}; pay HP for your @{mod1}", "Damage x@{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(125);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp, exposed], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, powerUp);
	addModifier(user, exposed);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText} ${user.getName(adventure.room.enemyIdMap)} is Powered Up and Exposed.`;
	});
}
