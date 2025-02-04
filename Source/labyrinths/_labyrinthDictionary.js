const { Adventure } = require("../../Classes/Adventure.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { generateRandomNumber } = require("../../helpers.js");
const { getRoom } = require("../Rooms/_roomDictionary.js");
const { consumableExists } = require("../consumables/_consumablesDictionary.js");
const { equipmentExists } = require("../equipment/_equipmentDictionary.js");

const LABYRINTHS = {};

for (const file of [
	"debugdungeon.js"
]) {
	const labyrinth = require(`./${file}`);
	for (const element in labyrinth.availableConsumables) {
		for (const consumable of labyrinth.availableConsumables[element]) {
			if (!consumableExists(consumable)) {
				console.error(`Unregistered consumable name in ${labyrinth.name}: ${consumable}`);
			}
		}
	}

	for (const element in labyrinth.availableEquipment) {
		for (const rarity in labyrinth.availableEquipment[element]) {
			for (const equipment of labyrinth.availableEquipment[element][rarity]) {
				if (!equipmentExists(equipment)) {
					console.error(`Unregistered equipment name in ${labyrinth.name}: ${equipment}`);
				}
			}
		}
	}

	for (const tag in labyrinth.availableRooms) {
		for (const roomTitle of labyrinth.availableRooms[tag]) {
			if (!getRoom(roomTitle)) {
				console.error(`Unregistered room title in ${labyrinth.name}: ${roomTitle}`);
			}
		}
	}
	LABYRINTHS[labyrinth.name] = labyrinth;
}

/** Lookup static property of a labyrinth by labyrinth name
 * @param {string} labyrinthName
 * @param {string} propertyName
 * @returns {any}
 */
exports.getLabyrinthProperty = function (labyrinthName, propertyName) {
	if (labyrinthName in LABYRINTHS) {
		const template = LABYRINTHS[labyrinthName];
		if (propertyName in template) {
			return template[propertyName];
		} else {
			console.error(`Property ${propertyName} not found in ${labyrinthName}`);
		}
	} else {
		console.error(`Labyrinth name ${labyrinthName} not recognized`);
	}
}

/** Rolls a consumable's name from droppable consumables
 * @param {Adventure} adventure
 * @returns {string}
 */
exports.rollConsumable = function (adventure) {
	const consumablePool = adventure.getElementPool().flatMap((element) => LABYRINTHS[adventure.labyrinth].availableConsumables[element]);

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

/** Internally decide the next boss of the given type, so scouting can provide that information
 * @param {"Final Battle" | "Artifact Guardian"} type
 * @param {Adventure} adventure
 */
exports.prerollBoss = function (type, adventure) {
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	const roomTitle = roomPool[generateRandomNumber(adventure, roomPool.length, "general")];
	if (type === "Artifact Guardian") {
		adventure.artifactGuardians.push(roomTitle);
	} else {
		adventure.finalBoss = roomTitle;
	}
}

/** Filters by type, then rolls a random room or returns the scouted room
 * @param {"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Forge" | "Artifact Guardian" | "Treasure" | "Empty"} type Room Types are internal tags that describe the contents of the room for randomization bucketing/UI generation purposes
 * @param {Adventure} adventure
 * @returns {RoomTemplate}
 */
exports.rollRoom = function (type, adventure) {
	if (type === "Artifact Guardian") {
		return getRoom(adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered]);
	}

	if (type === "Final Battle") {
		return getRoom(adventure.finalBoss);
	}

	if (!(type in LABYRINTHS[adventure.labyrinth].availableRooms)) {
		console.error("Attempt to create room of unidentified type: " + type);
		adventure.roomCandidates = {};
		adventure.roomCandidates[`Battle${SAFE_DELIMITER}${adventure.depth}`] = true;
		return LABYRINTHS["Debug Dungeon"].availableRooms["Empty"][0];
	}
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	return getRoom(roomPool[generateRandomNumber(adventure, roomPool.length, "general")]);
}
