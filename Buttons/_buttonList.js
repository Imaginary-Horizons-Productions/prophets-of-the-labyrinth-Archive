const fs = require('fs');

var buttonWhitelist = ["join.js"];
const buttonFiles = fs.readdirSync('./Buttons').filter(file => file.endsWith('.js') && buttonWhitelist.includes(file));
exports.buttonDictionary = {};

for (const file of buttonFiles) {
    const button = require(`./${file}`);
    exports.buttonDictionary[button.name] = button;
}
