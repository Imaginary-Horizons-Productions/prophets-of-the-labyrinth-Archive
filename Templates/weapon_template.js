const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", 1, "description", "element", effect, [])
	.setTargetingTags({ target: "", team: "" }) // tagObject {target: ["single", "all", "random", "self", "none"], team: ["delver", "enemy", "any", "self", "none"]}
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost()
	.setUses();

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger] } = module.exports;
	if (user.element === weaponElement) {

	}
	if (isCrit) {

	}
	return ""; // result text
}
