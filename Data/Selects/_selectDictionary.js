const fs = require('fs');

var selectWhitelist = ["weapon.js"];
const selectFiles = fs.readdirSync('./Data/Selects').filter(file => file.endsWith('.js') && selectWhitelist.includes(file));
exports.selectDictionary = {};

for (const file of selectFiles) {
    const select = require(`./${file}`);
    exports.selectDictionary[select.name] = select;
}
