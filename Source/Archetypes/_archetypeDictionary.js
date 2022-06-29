const archetypeDictionary = {};

for (const file of [
	"assassin.js",
	"chemist.js",
	"hemomancer.js",
	"knight.js",
	"martialartist.js",
	"ritualist.js"
]) {
	const archetype = require(`./${file}`);
	archetypeDictionary[archetype.title] = archetype;
}

exports.getArchetype = function (archetypeName) {
	return archetypeDictionary[archetypeName];
}
