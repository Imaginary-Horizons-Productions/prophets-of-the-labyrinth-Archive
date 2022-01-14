const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Life Drain", 1, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critMultiplier}", "Darkness", effect, ["Spell: Flanking Life Drain", "Spell: Reactive Life Drain", "Spell: Urgent Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, healing, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critMultiplier;
	}
	return `${await dealDamage(target, user, damage, weaponElement, adventure)} ${gainHealth(user, healing, adventure.room.enemyTitles)}`;
}
