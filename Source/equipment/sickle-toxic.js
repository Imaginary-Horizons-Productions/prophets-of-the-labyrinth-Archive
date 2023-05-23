const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Toxic Sickle", "*Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} (+5% foe max hp) @{element} damage and apply *\nCritical Hit💥: Damage x@{critBonus}", "Water", effect, ["Hunter's Sickle", "Sharpened Sickle"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(20)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
	damage += (0.05 * target.maxHp);
	addModifier(target, poison);
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
