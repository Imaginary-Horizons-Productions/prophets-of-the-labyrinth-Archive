const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Urgent Life Drain", 2, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp (+@{speedBonus} speed)*\nCritical Hit: Healing x@{critBonus}", "Darkness", effect, ["Spell: Flanking Life Drain", "Spell: Reactive Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25)
	.setSpeedBonus(5);

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
