const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Lethal Certain Victory", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}; pay HP for your @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Hunter's Certain Victory", "Reckless Certain Victory"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setCritBonus(3);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, powerUp);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText} ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	});
}
