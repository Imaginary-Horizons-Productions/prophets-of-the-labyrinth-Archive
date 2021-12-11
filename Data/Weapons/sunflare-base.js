const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Sun Flare", 1, "*Inflict 2 Stagger on a foe (+@{speedBonus} speed)*\nCritical Hit: Inflict 2 Slow as well\n", "Light", effect, ["Spell: Evasive Sun Flare", "Spell: Swift Sun Flare", "Spell: Tormenting Sun Flare"])
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
	return "";
}
