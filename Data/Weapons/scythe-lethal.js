const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Lethal Scythe", 2, "*Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonusDamage} hp*\nCritical Hit: Instant death threshold x@{critBonus}", "Darkness", effect, ["Toxic Scythe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBonusDamage(99)
	.setCritBonus(3);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, bonusDamage: hpThreshold, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		hpThreshold *= critBonus;
	}
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, false, weaponElement, adventure);
	} else {
		target.hp = 0;
		return `${getFullName(target, adventure.room.enemyTitles)} meets the reaper.`;
	}
}
