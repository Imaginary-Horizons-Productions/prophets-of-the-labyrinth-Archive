const Adventure = require("../../Classes/Adventure");
const Combatant = require("../../Classes/Combatant");
const { calculateTagContent } = require("../../helpers");

const modifierDictionary = {};

for (const file of [
	"absorb-earth.js",
	"absorb-fire.js",
	"absorb-water.js",
	"absorb-wind.js",
	"curse-of-midas.js",
	"evade.js",
	"exposed.js",
	"floating-mist-stance.js",
	"iron-fist-stance.js",
	"oblivious.js",
	"poison.js",
	"power-down.js",
	"power-up.js",
	"progress.js",
	"quicken.js",
	"regen.js",
	"slow.js",
	"stagger.js",
	"stasis.js",
	"vigilance.js",
	"stun.js"
]) {
	const modifier = require(`./${file}`);
	modifierDictionary[modifier.name] = modifier;
}

/**
 * @param {string} modifierName
 * @param {Combatant} bearer
 * @param {Adventure} adventure
 */
exports.getModifierDescription = function (modifierName, bearer, adventure) {
	return calculateTagContent(modifierDictionary[modifierName].description, [
		{ tag: 'stackCount', count: bearer.modifiers[modifierName] },
		{ tag: 'poise', count: bearer.staggerThreshold },
		{ tag: 'funnelCount', count: adventure.getArtifactCount("Spiral Funnel") },
		{ tag: 'roundDecrement', count: exports.getTurnDecrement(modifierName) }
	]);
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
