var selectWhitelist = [
	"archetype.js",
	"artifact.js",
	"buyweapon.js",
	"randomupgrade.js",
	"repair.js",
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
