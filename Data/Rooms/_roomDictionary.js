const fs = require('fs');

var roomWhitelist = ["goldonfire.js"];
const roomFiles = fs.readdirSync('./Data/Rooms').filter(file => file.endsWith('.js') && roomWhitelist.includes(file));
exports.roomDictionary = {};

for (const file of roomFiles) {
    const room = require(`./${file}`);
    exports.roomDictionary[room.title] = room;
}
