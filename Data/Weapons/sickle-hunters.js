const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Hunter's Sickle", "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage, gain 15g on kill*\nCritical Hit: Damage x@{critMultiplier}", "Water", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gold += 15;
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests 15g of alchemical reagents.`;
		}
		return damageText;
	}); // result text
}
