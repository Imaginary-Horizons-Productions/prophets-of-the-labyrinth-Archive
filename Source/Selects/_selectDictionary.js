const selectDictionary = {};

for (const file of [
	"archetype.js",
	"artifact.js",
	"artifactdupe.js",
	"buyconsumable.js",
	"buyequipment.js",
	"challenge.js",
	"collectartifact.js",
	"consumable.js",
	"loot.js",
	"movetarget.js",
	"randomupgrade.js",
	"repair.js",
	"startingartifact.js",
	"startingchallenges.js",
	"treasure.js"
]) {
	const select = require(`./${file}`);
	selectDictionary[select.name] = select;
}

exports.callSelect = function (mainId, interaction, args) {
	selectDictionary[mainId].execute(interaction, args);
}
