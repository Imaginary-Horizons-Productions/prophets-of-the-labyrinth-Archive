const fs = require('fs');

var buttonWhitelist = ["join.js", "ready.js", "continue.js", "getgoldonfire.js", "hpshare.js", "freegold.js"];
const buttonFiles = fs.readdirSync('./Data/Buttons').filter(file => file.endsWith('.js') && buttonWhitelist.includes(file));
exports.buttonDictionary = {};

for (const file of buttonFiles) {
    const button = require(`./${file}`);
    exports.buttonDictionary[button.name] = button;
}
