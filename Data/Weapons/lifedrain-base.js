const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Life Drain", "*Strike a foe for @{damage} @{element} damage, then gain @{bonusDamage} hp*\nCritical Hit: Healing x@{critMultiplier}", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses(10)
	.setDamage(105)
	.setBonusDamage(35);

async function effect(target, user, isCrit, adventure) {
	let { damage, bonusDamage, element: weaponElement, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		bonusDamage *= critMultiplier;
	}
	return `${await dealDamage(target, user, damage, weaponElement, adventure)} ${gainHealth(user, bonusDamage, adventure.room.enemyTitles)}`; // result text
}
