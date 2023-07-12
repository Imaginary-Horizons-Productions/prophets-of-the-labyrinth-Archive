const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { getEquipmentProperty } = require("../equipment/_equipmentDictionary.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Repair Kit", "Repairs all the user's equipment by 25% of its max uses", selectSelf, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +25% max uses to all equipment
	user.equipment.forEach((equip) => {
		const maxUses = getEquipmentProperty(equip.name, "maxUses");
		if (maxUses > 0 && equip.uses < maxUses) {
			equip.uses = Math.min(equip.uses + Math.ceil(maxUses / 4), maxUses);
		}
	})

	return "All their equipment regains some use.";
}
