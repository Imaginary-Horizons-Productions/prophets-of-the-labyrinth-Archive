var roomWhitelist = [
	"goldonfire.js",
	"hpshare.js",
	"forge.js",
	"freegold.js",
	"bruteconvention.js",
	"brutefight.js",
	"counterpartfight.js",
	"slimefight.js"
];

exports.roomDictionary = {};

for (const file of roomWhitelist) {
	const room = require(`./${file}`);
	exports.roomDictionary[room.title] = room;
}
