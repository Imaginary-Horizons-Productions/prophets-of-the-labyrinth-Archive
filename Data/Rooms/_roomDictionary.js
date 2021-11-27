const { generateRandomNumber } = require("../../helpers");

let roomWhitelist = [
	"goldonfire.js",
	"hpshare.js",
	"forge.js",
	"freegold.js",
	"counterpartfight.js",
	"hawkfight.js",
	"slimefight.js",
	"tortoisefight.js"
];

let eventRooms = [];
let battleRooms = [];
let merchantRooms = [];
let restRooms = [];
let finalBossRooms = [];
let midbossRooms = [];
let forgeRooms = [];

for (const file of roomWhitelist) {
	const room = require(`./${file}`);
	room.types.forEach(type => {
		switch (type) {
			case "event":
				eventRooms.push(room);
				break;
			case "battle":
				battleRooms.push(room);
				break;
			case "merchant":
				merchantRooms.push(room);
				break;
			case "rest":
				restRooms.push(room);
				break;
			case "finalboss":
				finalBossRooms.push(room);
				break;
			case "midboss":
				midbossRooms.push(room);
				break;
			case "forge":
				forgeRooms.push(room);
				break;
			default:
				console.error("Attempt to load room of unidentified type: " + type);
				break;
		}
	})
}

exports.getRoomTemplate = function (type, adventure) {
	// Prerolled Room
	let finalBossDepths = [10];
	let midbossDepths = [];
	if (finalBossDepths.includes(adventure.depth)) {
		return finalBossRooms[adventure.finalBoss];
	} else if (midbossDepths.includes(adventure.depth)) {
		return midbossRooms[adventure.midbosses[adventure.depth]]; //TODO #103 verify implementation after midbosses exist
	}

	// Nonprerolled Room
	switch (type) {
		case "event":
			return eventRooms[generateRandomNumber(adventure, eventRooms.length, "general")];
		case "battle":
			return battleRooms[generateRandomNumber(adventure, battleRooms.length, "general")];
		case "merchant":
			return merchantRooms[generateRandomNumber(adventure, merchantRooms.length, "general")];
		case "rest":
			return restRooms[generateRandomNumber(adventure, restRooms.length, "general")];
		case "finalboss":
			return finalBossRooms[generateRandomNumber(adventure, finalBossRooms.length, "general")];
		case "midboss":
			return midbossRooms[generateRandomNumber(adventure, midbossRooms.length, "general")];
		case "forge":
			return forgeRooms[generateRandomNumber(adventure, forgeRooms.length, "general")];
		default:
			console.error("Attempt to create room of unidentified type: " + type);
			return null; //TODO #104 return empty room
	}
}
