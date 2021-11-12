const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, gainHealth, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Earthen Potion", "*Grant a combatant @{bonusDamage} hp if they are Earth element, otherwise deal @{damage} @{element} damage*\nCritical Hit: Damage/Healing x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "any" })
	.setUses(5)
	.setDamage(100)
	.setBonusDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage: value, critMultiplier } = module.exports;
	if (isCrit) {
		value *= critMultiplier;
	}
	if (target.element === weaponElement) {
		value /= 2;
		if (user.element === weaponElement) {
			removeModifier(target, "Stagger", 1);
		}
		return gainHealth(target, value, adventure.room.enemyTitles);
	} else {
		if (user.element === weaponElement) {
			addModifier(target, "Stagger", 1);
		}
		return dealDamage(target, user, value, weaponElement, adventure);
	}
}
