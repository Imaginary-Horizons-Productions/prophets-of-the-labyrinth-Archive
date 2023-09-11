const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Toxic Sickle", "Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} (+5% foe max hp) @{element} damage and apply", "Damage x@{critBonus}", "Water", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Sickle", "Sharpened Sickle")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(20)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
	damage += (0.05 * target.maxHp);
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		if (target.hp > 0) {
			addModifier(target, poison);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		} else {
			return damageText;
		}
	});
}
