const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");

module.exports = new ConsumableTemplate("name", "description", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function selectTargets(userIndex, adventure) {
	// specification
	const team = "";
	const index = userIndex;
	return [[team, index]];
}

function effect(target, user, isCrit, adventure) {
	// specification
	return ``; // see style guide for conventions on result texts
}
