var archetype = [
	"assassin.js",
	"firestarter.js",
	"knight.js"
];

const archetypeDictionary = {};

for (const file of archetype) {
    const archetype = require(`./${file}`);
    archetypeDictionary[archetype.title] = archetype;
}

exports.getArchetype = (archetypeName) => {
	return archetypeDictionary[archetypeName];
}
