const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Hunter's Bow", "*Strike a foe for @{damage} @{element} damage (+@{speedBonus}), gain @{bonusDamage}g on kill*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Evasive Bow", "Mercurial Bow"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(15)
	.setSpeedBonus(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage: bonusBounty, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	});
}
