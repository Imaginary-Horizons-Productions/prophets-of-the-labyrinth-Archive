const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", "description", "element", effect)
	.setTargetingTags({ target: "", team: "" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
	.setUses();

function effect(target, user, isCrit, element, adventure) {
	// TODO #32 same element effect boost
	if (isCrit) {

	}
	return ""; // result as text
}
