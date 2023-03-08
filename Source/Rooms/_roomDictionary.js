const { SAFE_DELIMITER } = require("../../constants.js");
const { generateRandomNumber } = require("../../helpers.js");

const ROOMS = {
	"Event": [],
	"Battle": [],
	"Merchant": [],
	"Rest Site": [],
	"Final Battle": [],
	"Forge": [],
	"Artifact Guardian": [],
	"Empty": []
};

for (const file of [
	"artifactguardian-royalslime.js",
	"artifactguardian-treasureelemental.js",
	"battle-bloodtailhawks.js",
	"battle-firearrowfrogs.js",
	"battle-mechabees.js",
	"battle-slimes.js",
	"battle-tortoises.js",
	"empty.js",
	"event-elementswap.js",
	"event-freegoldonfire.js",
	"event-hpshare.js",
	"event-scorebeggar.js",
	"finalBattle-elkemist.js",
	"finalBattle-mechaqueen.js",
	"finalBattle-mirrors.js",
	"forge-basic.js",
	"merchant-basic.js",
	"restsite-basic.js"
]) {
	const room = require(`./${file}`);
	room.types.forEach(type => {
		if (ROOMS[type]) {
			ROOMS[type].push(room);
		} else {
			console.error("Attempt to load room of unidentified type: " + type);
		}
	})
}

exports.prerollBoss = function (type, adventure) {
	let roomPool = ROOMS[type];
	let roomTitle = roomPool[generateRandomNumber(adventure, roomPool.length, "general")].title;
	if (type === "Artifact Guardian") {
		adventure.artifactGuardians.push(roomTitle);
	} else {
		adventure.finalBoss = roomTitle;
	}
}

exports.manufactureRoomTemplate = function (type, adventure) {
	let roomPool = ROOMS[type];
	if (type === "Artifact Guardian") {
		return roomPool.find(room => room.title === adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered]);
	}

	if (type === "Final Battle") {
		return roomPool.find(room => room.title === adventure.finalBoss);
	}

	if (!roomPool) {
		console.error("Attempt to create room of unidentified type: " + type);
		adventure.roomCandidates = {};
		adventure.roomCandidates[`Battle${SAFE_DELIMITER}${adventure.depth}`] = true;
		return ROOMS["Empty"][0];
	}
	return roomPool[generateRandomNumber(adventure, roomPool.length, "general")];
}
