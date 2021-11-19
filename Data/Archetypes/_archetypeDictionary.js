var archetype = [
	"assassin.js",
	"chemist.js",
	"hemomancer.js",
	"knight.js",
	"martialartist.js"
];

const archetypeDictionary = {};

for (const file of archetype) {
    const archetype = require(`./${file}`);
    archetypeDictionary[archetype.title] = archetype;
}

exports.getArchetype = function (archetypeName) {
	return archetypeDictionary[archetypeName];
}
