var modifierWhitelist = [
	"evade.js",
	"powerup.js",
	"slow.js"
];

const modifierDictionary = {};

for (const file of modifierWhitelist) {
	const modifier = require(`./${file}`);
	modifierDictionary[modifier.name] = modifier;
}

exports.getModifierDescription = (modifierName) => {
	return modifierDictionary[modifierName].description;
}

exports.getTurnDecrement = (modifierName) => {
	return modifierDictionary[modifierName].turnDecrement;
}

exports.isBuff = (modifierName) => {
	return modifierDictionary[modifierName].isBuff;
}

exports.isDebuff = (modifierName) => {
	return modifierDictionary[modifierName].isDebuff;
}

exports.isNonStacking = (modifierName) => {
	return modifierDictionary[modifierName].isNonStacking;
}
