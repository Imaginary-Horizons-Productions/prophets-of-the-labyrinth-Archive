const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Sickle", "Attack an enemy and deal 10% max HP damage (crit: more damage)", "Water", effect, ["Hunter's Sickle", "Sharpened Sickle", "Thick Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75 + (0.1 * target.maxHp);
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		return damageText;
	}); // result text
}
