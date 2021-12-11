const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Toxic Scythe", 2, "*Strike a foe applying 3 Poison and @{damage} @{element} damage; instant death if foe is at or below @{bonusDamage} hp*\nCritical Hit: Instant death threshold x@{critMultiplier}", "Darkness", effect, ["Lethal Scythe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(15)
	.setDamage(75)
	.setBonusDamage(99);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage: hpThreshold, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		hpThreshold *= critMultiplier;
	}
	addModifier(target, "Poison", 3);
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, weaponElement, adventure);
	} else {
		target.hp = 0;
		return `${getFullName(target, adventure.room.enemyTitles)} meets the reaper.`;
	}
}
