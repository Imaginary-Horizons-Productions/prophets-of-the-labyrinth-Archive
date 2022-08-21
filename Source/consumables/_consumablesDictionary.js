const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");

const CONSUMABLES = {};

for (const file of [
	"blockpotion.js",
	"earthenpotion.js",
	"explosionpotion.js",
	"fierypotion.js",
	"healthpotion.js",
	"oblivionsalt.js",
	"quickpepper.js",
	"regenroot.js",
	"repairkit.js",
	"smokebomb.js",
	"stasisquartz.js",
	"strengthspinach.js",
	"vitamins.js",
	"waterypotion.js",
	"windypotion.js"
]) {
	const consumable = require(`./${file}`);
	CONSUMABLES[consumable.name] = consumable;
}

/** Template should not be mutated
 * @param {string} consumableName
 * @returns {ConsumableTemplate}
 */
exports.getConsumable = function (consumableName) {
	return CONSUMABLES[consumableName];
}
