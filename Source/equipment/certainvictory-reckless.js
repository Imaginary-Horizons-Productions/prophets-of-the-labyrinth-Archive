const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reckless Certain Victory", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}; pay HP for your @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Hunter's Certain Victory", "Lethal Certain Victory"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(125);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp, exposed], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, powerUp);
	addModifier(user, exposed);
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText}`;
	});
}
