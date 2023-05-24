const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Slowing Lance", "Strike a foe for @{damage} @{element} damage, then inflict @{mod1Stacks} @{mod1} on them and gain @{mod2Stacks} @{mod2}", "Damage x@{critBonus}", "Earth", effect, ["Guarding Lance", "Reckless Lance"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Slow", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp, slow], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, slow);
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure);
}
