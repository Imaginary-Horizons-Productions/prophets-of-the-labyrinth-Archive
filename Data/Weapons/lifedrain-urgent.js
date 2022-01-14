const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Urgent Life Drain", 2, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp (+@{speedBonus} speed)*\nCritical Hit: Healing x@{critMultiplier}", "Darkness", effect, ["Spell: Flanking Life Drain", "Spell: Reactive Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25)
	.setSpeedBonus(10);

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
