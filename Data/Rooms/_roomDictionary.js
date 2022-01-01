const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate");
const { generateRandomNumber } = require("../../helpers");

let roomWhitelist = [
	"artifactguardian-royalslime.js",
	"battle-hawks.js",
	"battle-mechabees.js",
	"battle-slimes.js",
	"battle-tortoises.js",
	"event-elementswap.js",
	"event-freegold.js",
	"event-goldonfire.js",
	"event-hpshare.js",
	"event-scorebeggar.js",
	"finalBattle-mirrors.js",
	"forge-basic.js",
	"merchant-basic.js",
	"restsite-basic.js"
];

const eventRooms = [];
const battleRooms = [];
const merchantRooms = [];
const restRooms = [];
const finalBossRooms = [];
const midbossRooms = [];
const forgeRooms = [];

for (const file of roomWhitelist) {
	const room = require(`./${file}`);
	room.types.forEach(type => {
		switch (type) {
			case "Event":
				eventRooms.push(room);
				break;
			case "Battle":
				battleRooms.push(room);
				break;
			case "Merchant":
				merchantRooms.push(room);
				break;
			case "Rest Site":
				restRooms.push(room);
				break;
			case "Final Battle":
				finalBossRooms.push(room);
				break;
			case "Artifact Guardian":
				midbossRooms.push(room);
				break;
			case "Forge":
				forgeRooms.push(room);
				break;
			default:
				console.error("Attempt to load room of unidentified type: " + type);
				break;
		}
	})
}

exports.prerollBoss = function (type, adventure) {
	if (type === "Relic Guardian") {
		adventure.artifactGuardians.push(midbossRooms[generateRandomNumber(adventure, midbossRooms.length, "general")].title);
	} else {
		adventure.finalBoss = finalBossRooms[generateRandomNumber(adventure, finalBossRooms.length, "general")].title;
	}
}

exports.getRoomTemplate = function (type, adventure) {
	switch (type) {
		case "Event":
			return eventRooms[generateRandomNumber(adventure, eventRooms.length, "General")];
		case "Battle":
			return battleRooms[generateRandomNumber(adventure, battleRooms.length, "General")];
		case "Merchant":
			return merchantRooms[generateRandomNumber(adventure, merchantRooms.length, "General")];
		case "Rest Site":
			return restRooms[generateRandomNumber(adventure, restRooms.length, "General")];
		case "Final Battle":
			return finalBossRooms.find(room => room.title === adventure.finalBoss);
		case "Artifact Guardian":
			return midbossRooms.find(room => room.title === adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered]);
		case "Forge":
			return forgeRooms[generateRandomNumber(adventure, forgeRooms.length, "General")];
		default:
			console.error("Attempt to create room of unidentified type: " + type);
			let empty = new RoomTemplate().setTitle("Empty Room")
				.setDescription("This room is empty. Lucky you?");
			adventure.roomCandidates = {
				"Battle": true
			};
			empty.uiRows.push(new MessageActionRow().addComponents(
				new MessageButton().setCustomId("continue")
					.setLabel("Move on")
					.setStyle("SECONDARY")
			))
			return empty;
	}
}
