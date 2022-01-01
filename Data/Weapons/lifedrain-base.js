const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Life Drain", 1, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critMultiplier}", "Darkness", effect, ["Spell: Reactive Life Drain", "Spell: Urgent Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect(target, user, isCrit, adventure) {
	let { damage, healing, element: weaponElement, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		healing *= critMultiplier;
	}
	return `${await dealDamage(target, user, damage, weaponElement, adventure)} ${gainHealth(user, healing, adventure.room.enemyTitles)}`;
}
