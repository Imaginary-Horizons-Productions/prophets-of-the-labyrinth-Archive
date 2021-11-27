var roomWhitelist = [
	"goldonfire.js",
	"hpshare.js",
	"forge.js",
	"freegold.js",
	"counterpartfight.js",
	"hawkfight.js",
	"slimefight.js",
	"tortoisefight.js"
];

exports.roomDictionary = {};

for (const file of roomWhitelist) {
	const room = require(`./${file}`);
	exports.roomDictionary[room.title] = room;
}
