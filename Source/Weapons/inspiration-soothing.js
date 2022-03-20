const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Soothing Inspiration", 2, "Apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to an ally*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to an delver", "Light", effect, ["Reinforcing Inspiration", "Sweeping Inspiration"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, {name: "Regen", stacks: 2}, { name: "Power Up", stacks: 50 }])
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp, regen, critPowerUp] } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPowerUp);
	} else {
		addModifier(target, powerUp);
	}
	addModifier(target, regen);
	return "";
}
