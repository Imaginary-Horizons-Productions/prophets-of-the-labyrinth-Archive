const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Toxic Scythe", "*Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage; instant death if foe is at or below @{bonusDamage} hp*\nCritical Hit💥: Instant death threshold x@{critBonus}", "Wind", effect, ["Lethal Scythe", "Piercing Scythe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(99);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, poison], damage, bonusDamage: hpThreshold, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		hpThreshold *= critBonus;
	}
	addModifier(target, poison);
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, false, element, adventure);
	} else {
		target.hp = 0;
		return `${getFullName(target, adventure.room.enemyTitles)} meets the reaper.`;
	}
}
