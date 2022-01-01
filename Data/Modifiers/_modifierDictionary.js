var modifierWhitelist = [
	"absorb-darkness.js",
	"absorb-earth.js",
	"absorb-fire.js",
	"absorb-light.js",
	"absorb-water.js",
	"absorb-wind.js",
	"evade.js",
	"poison.js",
	"powerdown.js",
	"powerup.js",
	"quicken.js",
	"regen.js",
	"slow.js",
	"stagger.js",
	"stun.js"
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

exports.getInverse = (modifierName) => {
	return modifierDictionary[modifierName].inverse;
}
