var roomWhitelist = [
	"goldonfire.js",
	"hpshare.js",
	"freegold.js",
	"brutefight.js",
	"counterpartfight.js"
];

exports.roomDictionary = {};

for (const file of roomWhitelist) {
	const room = require(`./${file}`);
	exports.roomDictionary[room.title] = room;
}
