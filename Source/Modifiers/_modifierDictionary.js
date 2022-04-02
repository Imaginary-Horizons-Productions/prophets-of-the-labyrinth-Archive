let parseCount;
exports.injectConfig = function (isProduction) {
	({ parseCount } = require("../../helpers").injectConfig(isProduction));
	return this;
}

var modifierWhitelist = [
	"absorb-darkness.js",
	"absorb-earth.js",
	"absorb-fire.js",
	"absorb-light.js",
	"absorb-water.js",
	"absorb-wind.js",
	"curse-of-midas.js",
	"evade.js",
	"exposed.js",
	"poison.js",
	"power-down.js",
	"power-up.js",
	"progress.js",
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

exports.getModifierDescription = function (modifierName, bearer) {
	let description = modifierDictionary[modifierName].description;
	let stackCountExpression = description.match(/@{(stackCount[\*\d]*)}/)?.[1].replace(/stackCount/g, "n");
	if (stackCountExpression) {
		description = description.replace(/@{stackCount[\d*]*}/g, parseCount(stackCountExpression, bearer.modifiers[modifierName]));
	}
	return description.replace(/@{poise}/g, bearer.staggerThreshold)
		.replace(/@{roundDecrement}/g, exports.getTurnDecrement(modifierName));
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
