var archetype = [
	"assassin.js",
	"chemist.js",
	"knight.js",
	"martialartist.js"
];

const archetypeDictionary = {};

for (const file of archetype) {
    const archetype = require(`./${file}`);
    archetypeDictionary[archetype.title] = archetype;
}

exports.getArchetype = (archetypeName) => {
	return archetypeDictionary[archetypeName];
}
