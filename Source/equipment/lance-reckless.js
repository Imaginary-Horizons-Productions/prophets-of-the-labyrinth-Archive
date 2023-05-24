const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reckless Lance", "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage and gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Guarding Lance", "Slowing Lance"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(50)
	.setBonusDamage(100);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp], damage, bonusDamage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	if (user.block === 0) {
		damage += bonusDamage;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure);
}
