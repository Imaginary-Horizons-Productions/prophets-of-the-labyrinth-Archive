const { generateRandomNumber } = require("../../helpers.js");

const ARTIFACTS = {};

const ROLL_TABLE = {
	Earth: [],
	Wind: [],
	Water: [],
	Fire: [],
	Untyped: []
}

for (const file of [
	"amethystspyglass.js",
	"bloodshieldsword.js",
	"enchantedmap.js",
	"hammerspaceholster.js",
	"hawktailfeather.js",
	"negativeoneleafclover.js",
	"oilpainting.js",
	"phoenixfruitblossom.js"
]) {
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name] = artifact;
	ROLL_TABLE[artifact.element].push(artifact.name);
}

exports.getArtifact = function (artifactName) {
	return ARTIFACTS[artifactName];
}

exports.getArtifactCounts = function () {
	return Object.values(ARTIFACTS).length; //TODO #225 separate artifact counts by element
}

exports.rollArtifact = function (adventure) {
	let elementPool = [...adventure.delvers.map(delver => delver.element), "Untyped"];
	let artifactPool = elementPool.reduce((artifacts, element) => artifacts.concat(ROLL_TABLE[element]), []);
	return artifactPool[generateRandomNumber(adventure, artifactPool.length, "general")];;
}
