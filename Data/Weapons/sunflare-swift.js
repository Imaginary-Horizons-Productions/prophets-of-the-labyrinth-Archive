const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Swift Sun Flare", "*Inflict 2 Stagger on a foe, then gain 2 Quicken (+@{speedBonus} speed)* Critical Hit: Inflict 2 Slow as well\n", "Light", effect, ["Spell: Evasive Sun Flare", "Spell: Tormenting Sun Flare"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Slow", 2);
	}
	addModifier(target, "Stagger", 2);
	addModifier(user, "Quicken", 2);
	return "";
}
