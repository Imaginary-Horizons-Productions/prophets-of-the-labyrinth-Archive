const { generateRandomNumber } = require("../../helpers");

let artifactWhitelist = [
	"enchantedmap.js"
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

exports.rollArtifact = function (element, adventure) {
	return ROLL_TABLE[element][generateRandomNumber(adventure, ROLL_TABLE[element].length, "General")];
}
