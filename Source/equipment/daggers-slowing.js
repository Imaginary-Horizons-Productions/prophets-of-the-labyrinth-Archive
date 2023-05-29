const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Slowing Daggers", "Strike a foe for @{damage} @{element} damage and inflict @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritBonus(3)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, slow], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, slow);
	return dealDamage(target, user, damage, false, element, adventure);
}
