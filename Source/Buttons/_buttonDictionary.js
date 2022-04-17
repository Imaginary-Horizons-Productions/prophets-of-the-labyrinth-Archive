var buttonWhitelist = [
	"buylife.js",
	"buyscouting.js",
	"challenge.js",
	"collectartifact.js",
	"continue.js",
	"deploy.js",
	"elementswap.js",
	"getgoldonfire.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"nontargetweapon.js",
	"predict.js",
	"ready.js",
	"readymove.js",
	"repair.js",
	"replaceweapon.js",
	"rest.js",
	"routevote.js",
	"startingartifact.js",
	"takegold.js",
	"upgrade.js"
];

const buttonDictionary = {};

for (const file of buttonWhitelist) {
	const button = require(`./${file}`);
	buttonDictionary[button.name] = button;
}

exports.getButton = (buttonName) => {
	return buttonDictionary[buttonName];
}
