const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Reinforcing Inspiration", 2, "Apply @{mod1Stacks} @{mod1} and @{block} block to an ally*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to an delver", "Light", effect, ["Soothing Inspiration", "Sweeping Inspiration"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 50 }])
	.setBlock(25)
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp, critPowerUp], block } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPowerUp);
	} else {
		addModifier(target, powerUp);
	}
	addBlock(target, block);
	return "";
}
