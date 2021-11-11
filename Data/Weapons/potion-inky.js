const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, gainHealth, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Inky Potion", "Heal a darkness element combatant, damage everyone else (crit: more healing/damage)", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "any" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let value = 100;
	if (isCrit) {
		value *= 2;
	}
	if (target.element === "Darkness") {
		value /= 2;
		if (user.element === element) {
			removeModifier(target, "Stagger", 1);
		}
		return gainHealth(target, value, adventure.room.enemyTitles);
	} else {
		if (user.element === element) {
			addModifier(target, "Stagger", 1);
		}
		return dealDamage(target, user, value, element, adventure).then(damageText => {
			return damageText;
		});
	}
}
