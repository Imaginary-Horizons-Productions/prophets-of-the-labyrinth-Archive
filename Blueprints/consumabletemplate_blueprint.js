const Consumable = require("../../Classes/ConsumableTemplate.js");

module.exports = new Consumable("name", "description", effect)
	.setElement("Untyped")
	.setFlavorText([]);

function effect(user, adventure) {
	// specification
	return ``; // result text
}
