let generateRandomNumber, parseCount;
exports.injectConfigArtifacts = function (isProduction) {
	({ generateRandomNumber, parseCount } = require("../../helpers.js").injectConfig(isProduction));
	return this;
}

let artifactWhitelist = [
	"amethystspyglass.js",
	"bloodshieldsword.js",
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
	let description = exports.getArtifact(artifactName).description;
	let copiesExpression = description.match(/@{(copies[\*\d]*)}/)?.[1].replace(/copies/g, "n");
	if (copiesExpression) {
		copies = parseCount(copiesExpression, copies);
	}

	return description.replace(/@{copies.*}/g, copies);
}

exports.getArtifactCounts = function () {
	return Object.values(ARTIFACTS).length; //TODO #225 separate artifact counts by element
}

exports.rollArtifact = function (adventure) {
	let elementPool = [...adventure.delvers.map(delver => delver.element), "Untyped"];
	let artifactPool = elementPool.reduce((artifacts, element) => artifacts.concat(ROLL_TABLE[element]), []);
	return artifactPool[generateRandomNumber(adventure, artifactPool.length, "general")];;
}
