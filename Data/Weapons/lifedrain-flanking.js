const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Flanking Life Drain", 2, "*Strike a foe for @{damage} @{element} damage and inflict @{mod1Stacks} @{mod1}, then gain @{healing} hp*\nCritical Hit: Healing x@{critBonus}", "Darkness", effect, ["Spell: Reactive Life Drain", "Spell: Urgent Life Drain"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, exposed], damage, healing, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	let damageText = await dealDamage(target, user, damage, false, weaponElement, adventure);
	addModifier(target, exposed);
	return `${damageText} ${gainHealth(user, healing, adventure.room.enemyTitles)}`;
}
