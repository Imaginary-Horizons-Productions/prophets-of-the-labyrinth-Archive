const fs = require('fs');

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
	"read.js",
	"ready.js",
	"readymove.js",
	"self.js"
];
const buttonFiles = fs.readdirSync('./Data/Buttons').filter(file => file.endsWith('.js') && buttonWhitelist.includes(file));
exports.buttonDictionary = {};

for (const file of buttonFiles) {
	const button = require(`./${file}`);
	exports.buttonDictionary[button.name] = button;
}
