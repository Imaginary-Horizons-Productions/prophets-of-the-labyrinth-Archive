const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth, calculateTotalSpeed } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Reactive Life Drain", "*Strike a foe for @{damage} (+@{bonusDamage} if foe went first) @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critMultiplier}", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses(10)
	.setDamage(105)
	.setHealing(35)
	.setBonusDamage(50);

async function effect(target, user, isCrit, adventure) {
	let { damage, bonusDamage, healing, element: weaponElement, critMultiplier } = module.exports;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		healing *= critMultiplier;
	}
	return `${await dealDamage(target, user, damage, weaponElement, adventure)} ${gainHealth(user, healing, adventure.room.enemyTitles)}`; // result text
}
