const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reckless Certain Victory", "Strike a foe for @{damage} (+@{bonus} if you have 0 block) @{element} damage, gain @{mod1Stacks} @{mod1} and pay HP equal to your @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Hunter's Certain Victory", "Lethal Certain Victory"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(50)
	.setBonus(100); // damage

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp], damage, bonus, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	if (user.block === 0) {
		damage += bonus;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText}`;
	});
}
