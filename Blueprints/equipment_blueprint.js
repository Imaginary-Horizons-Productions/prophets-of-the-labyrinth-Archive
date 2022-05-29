const Equipment = require('../../Classes/Equipment.js');

module.exports = new Equipment("name", 1, "description", "element", effect, [])
	.setCategory("")
	.setTargetingTags({ target: "", team: "" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost()
	.setUses();

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger] } = module.exports;
	if (user.element === element) {

	}
	if (isCrit) {

	}
	return ""; // result text
}
