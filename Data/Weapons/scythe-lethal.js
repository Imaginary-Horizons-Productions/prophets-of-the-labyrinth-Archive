const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Lethal Scythe", 2, "*Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonusDamage} hp*\nCritical Hit: Instant death threshold x@{critMultiplier}", "Darkness", effect, ["Toxic Scythe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(15)
	.setDamage(75)
	.setBonusDamage(99)
	.setCritMultiplier(3);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage: hpThreshold, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		hpThreshold *= critMultiplier;
	}
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, weaponElement, adventure);
	} else {
		target.hp = 0;
		return `${getFullName(target, adventure.room.enemyTitles)} meets the reaper.`;
	}
}
