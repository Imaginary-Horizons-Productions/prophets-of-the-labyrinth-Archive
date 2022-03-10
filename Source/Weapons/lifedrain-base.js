const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Life Drain", 1, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critBonus}", "Darkness", effect, ["Spell: Flanking Life Drain", "Spell: Reactive Life Drain", "Spell: Urgent Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, healing, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	return `${await dealDamage(target, user, damage, false, weaponElement, adventure)} ${gainHealth(user, healing, adventure)}`;
}
