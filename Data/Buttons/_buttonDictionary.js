var buttonWhitelist = [
	"continue.js",
	"deploy.js",
	"freegold.js",
	"getgoldonfire.js",
	"giveup.js",
	"hpshare.js",
	"join.js",
	"nontargetweapon.js",
	"partystats.js",
	"predict.js",
	"ready.js",
	"readymove.js",
	"self.js",
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
