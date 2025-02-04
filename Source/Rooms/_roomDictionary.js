const RoomTemplate = require("../../Classes/RoomTemplate");

const ROOMS = {};

for (const file of [
	"artifactguardian-royalslime.js",
	"artifactguardian-treasureelemental.js",
	"battle-bloodtailhawks.js",
	"battle-firearrowfrogs.js",
	"battle-mechabees.js",
	"battle-slimes.js",
	"battle-tortoises.js",
	"empty.js",
	"event-artifactdupe.js",
	"event-elementswap.js",
	"event-freegoldonfire.js",
	"event-freerepairkit.js",
	"event-hpshare.js",
	"event-scorebeggar.js",
	"finalBattle-elkemist.js",
	"finalBattle-mechaqueen.js",
	"finalBattle-mirrors.js",
	"forge-basic.js",
	"merchant-basic.js",
	"merchant-consumable.js",
	"merchant-overpriced.js",
	"restsite-basic.js",
	"treasure-artifactvsgear.js",
	"treasure-artifactvsgold.js",
	"treasure-artifactvsitems.js",
	"treasure-gearvsitems.js",
	"treasure-goldvsgear.js",
	"treasure-goldvsitems.js"
]) {
	const room = require(`./${file}`);
	ROOMS[room.title] = room;
}

/** Room titles double as identifier for now, so must be unique
 * @param {string} roomTitle
 * @returns {RoomTemplate}
 */
exports.getRoom = function (roomTitle) {
	return ROOMS[roomTitle];
}
