const fs = require('fs');

var characterWhitelist = [
	"assassin.js",
	"knight.js"
];
const characterFiles = fs.readdirSync('./Data/Characters').filter(file => file.endsWith('.js') && characterWhitelist.includes(file));
exports.characterDictionary = {};

for (const file of characterFiles) {
    const character = require(`./${file}`);
    exports.characterDictionary[character.title] = character;
}
