const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", "description", "element", effect, [])
	.setTargetingTags({ target: "", team: "" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses();

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	if (user.element === weaponElement) {

	}
	if (isCrit) {

	}
	return ""; // result text
}
