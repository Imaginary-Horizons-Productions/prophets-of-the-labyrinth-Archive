const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Inspire", 1, "Apply @{mod1Stacks} @{mod1} to an ally*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to an ally", "Light", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "powerup", stacks: 25 }, { name: "powerup", stacks: 50 }])
	.setCost(200)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp, critPowerUp] } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPowerUp);
	} else {
		addModifier(target, powerUp);
	}
	return "";
}
