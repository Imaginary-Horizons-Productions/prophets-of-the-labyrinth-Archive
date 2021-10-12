const fs = require('fs');

var modifierWhitelist = [
	"evade.js",
	"powerup.js",
	"slow.js"
];
const modifierFiles = fs.readdirSync('./Data/Modifiers').filter(file => file.endsWith('.js') && modifierWhitelist.includes(file));
exports.modifierDictionary = {};

for (const file of modifierFiles) {
	const modifier = require(`./${file}`);
	exports.modifierDictionary[modifier.name] = modifier;
}

exports.getModifierDescription = (modifierName) => {
	return exports.modifierDictionary[modifierName].description;
}

exports.getTurnDecrement = (modifierName) => {
	return exports.modifierDictionary[modifierName].turnDecrement;
}

exports.isBuff = (modifierName) => {
	return exports.modifierDictionary[modifierName].isBuff;
}

exports.isDebuff = (modifierName) => {
	return exports.modifierDictionary[modifierName].isDebuff;
}

exports.isNonStacking = (modifierName) => {
	return exports.modifierDictionary[modifierName].isNonStacking;
}
