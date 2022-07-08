const { generateRandomNumber } = require("../../helpers.js");

const CONSUMABLES = {};

const ROLL_TABLE = {
	Earth: [],
	Wind: [],
	Water: [],
	Fire: [],
	Untyped: []
}

for (const file of [
	"vitamins.js"
]) {
	const consumable = require(`./${file}`);
	CONSUMABLES[consumable.name] = consumable;
	ROLL_TABLE[consumable.element].push(consumable.name);
}

exports.getConsumable = function (consumableName) {
	return CONSUMABLES[consumableName];
}

exports.rollConsumable = function (adventure) {
	let consumablePool = adventure.getElementPool().reduce((artifacts, element) => artifacts.concat(ROLL_TABLE[element]), []);
	return consumablePool[generateRandomNumber(adventure, consumablePool.length, "general")];
}
