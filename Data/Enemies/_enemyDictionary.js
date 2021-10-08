const fs = require('fs');

var enemyWhitelist = [
	"brute.js",
	"mirrorclone.js"
];
const enemyFiles = fs.readdirSync('./Data/Enemies').filter(file => file.endsWith('.js') && enemyWhitelist.includes(file));
exports.enemyDictionary = {};

for (const file of enemyFiles) {
	const enemy = require(`./${file}`);
	exports.enemyDictionary[enemy.name] = enemy;
}
