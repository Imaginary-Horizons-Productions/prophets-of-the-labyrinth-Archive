const Adventure = require("../../Classes/Adventure.js");
const { generateRandomNumber } = require("../../helpers.js");

const LABYRINTHS = {};

for (const file of [
	"debugdungeon.js"
]) {
	const labyrinth = require(`./${file}`);
	LABYRINTHS[labyrinth.name] = labyrinth;
}

/**
 * Lookup static property of a labyrinth by labyrinth name
 * @param {string} labyrinthName 
 * @param {string} propertyName 
 * @returns {any}
 */
exports.getLabyrinthProperty = function (labyrinthName, propertyName) {
	if (labyrinthName in LABYRINTHS) {
		if (propertyName in LABYRINTHS[labyrinthName]) {
			return LABYRINTHS[labyrinthName][propertyName];
		}
		console.error(`property ${propertyName} not found in ${labyrinthName}`);

	}
	console.error(`Labyrinth name ${labyrinthName} not recognized`);
}

/** Rolls a consumable's name from droppable consumables
 * @param {Adventure} adventure
 * @param {string} targetString
 * @returns {string}
 */
exports.rollConsumable = function (adventure, targetString = "") {
	const consumablePool = adventure.getElementPool().flatMap((element) => {
		return LABYRINTHS[adventure.labyrinth].availableConsumables[element]
			.filter(consumable => consumable.includes(targetString))
	});

	return consumablePool[generateRandomNumber(adventure, consumablePool.length, "general")];
}

/** Filters by party element pool and given tier, then rolls a random equipment's name
 * @param {"Cursed" | "Common" | "Rare"} tier
 * @param {Adventure} adventure
 * @returns {string} the name of the dropped equipment
 */
exports.rollEquipmentDrop = function (tier, adventure) {
	const pool = adventure.getElementPool().flatMap(element => LABYRINTHS[adventure.labyrinth].availableEquipment[element][tier]);
	return pool[generateRandomNumber(adventure, pool.length, "general")];
}
