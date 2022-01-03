const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Sweeping Inspiration", 1, "Apply @{mod1Stacks} @{mod1} to all allies*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to all allies", "Light", effect, [])
	.setTargetingTags({ target: "all", team: "ally" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 50 }])
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
