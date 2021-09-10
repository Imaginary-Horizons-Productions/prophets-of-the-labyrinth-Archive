const fs = require('fs');

var selectWhitelist = [];
const selectFiles = fs.readdirSync('./Selects').filter(file => file.endsWith('.js') && selectWhitelist.includes(file));
exports.selectDictionary = {};

for (const file of selectFiles) {
    const select = require(`./${file}`);
    exports.selectDictionary[select.name] = select;
}
