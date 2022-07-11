const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { getEquipmentProperty } = require("../equipment/_equipmentDictionary.js");

module.exports = new ConsumableTemplate("Repair Kit", "Repairs all the user's equipment by 25% of its max uses", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function selectTargets(userIndex, adventure) {
	// self
	const team = "self";
	const index = userIndex;
	return [[team, index]];
}

function effect(target, user, isCrit, adventure) {
	// +25% max uses to all equipment
	user.equipment.forEach((equip) => {
		const maxUses = getEquipmentProperty(equip.name, "maxUses");
		if (maxUses > 0 && equip.uses < maxUses) {
			equip.uses = Math.min(equip.uses + Math.ceil(maxUses / 4), maxUses);
		}
	})

	return "All their equipment regains some use.";
}
