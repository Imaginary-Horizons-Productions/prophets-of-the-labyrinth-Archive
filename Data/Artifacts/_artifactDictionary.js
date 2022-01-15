const { generateRandomNumber } = require("../../helpers");

let artifactWhitelist = [
	"amethystspyglass.js",
	"enchantedmap.js",
	"hammerspaceholster.js",
	"oilpainting.js",
	"phoenixfruitblossom.js"
];

const ARTIFACTS = {};

const ROLL_TABLE = {
	Earth: [],
	Wind: [],
	Water: [],
	Fire: [],
	Light: [],
	Darkness: [],
	Untyped: []
}

for (const file of artifactWhitelist) {
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name] = artifact;
	ROLL_TABLE[artifact.element].push(artifact.name);
}

exports.getArtifact = function (artifactName) {
	return ARTIFACTS[artifactName];
}

exports.getArtifactDescription = function (artifactName, copies) {
	return exports.getArtifact(artifactName).description.replace(/@{copies}/g, copies);
}

exports.rollArtifact = function (adventure) {
	let elementPool = [...adventure.delvers.map(delver => delver.element), "Untyped"];
	let element = elementPool[generateRandomNumber(adventure, elementPool.length, "general")];
	return ROLL_TABLE[element][generateRandomNumber(adventure, ROLL_TABLE[element].length, "general")];
}
