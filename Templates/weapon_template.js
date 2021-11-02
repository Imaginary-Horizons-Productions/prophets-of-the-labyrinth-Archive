const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", "description", "element", effect, [])
	.setTargetingTags({ target: "", team: "" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses();

function effect(target, user, isCrit, element, adventure) {
	if (user.element === element) {

	}
	if (isCrit) {

	}
	return ""; // result text
}
