const selectDictionary = {};

for (const file of [
	"archetype.js",
	"artifact.js",
	"buyequipment.js",
	"challenge.js",
	"collectartifact.js",
	"consumable.js",
	"consumablestats.js",
	"loot.js",
	"randomupgrade.js",
	"repair.js",
	"startingartifact.js",
	"startingchallenges.js",
	"targetmove.js"
]) {
	const select = require(`./${file}`);
	selectDictionary[select.name] = select;
}

exports.callSelect = function (mainId, interaction, args) {
	selectDictionary[mainId].execute(interaction, args);
}
