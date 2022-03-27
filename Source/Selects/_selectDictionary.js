var selectWhitelist = [
	"archetype.js",
	"artifact.js",
	"buyweapon.js",
	"challenge.js",
	"collectartifact.js",
	"loot.js",
	"randomupgrade.js",
	"repair.js",
	"startingartifact.js",
	"weapon.js"
];

const selectDictionary = {};

for (const file of selectWhitelist) {
	const select = require(`./${file}`);
	selectDictionary[select.name] = select;
}

exports.getSelect = (selectName) => {
	return selectDictionary[selectName];
}
