var enemyWhitelist = [
	"clone.js",
	"geodetortoise.js",
	"hawk.js",
	"mechabee.js",
	"ooze.js",
	"slime.js"
];

const enemyDictionary = {};

for (const file of enemyWhitelist) {
	const enemy = require(`./${file}`);
	enemyDictionary[enemy.name] = enemy;
}

exports.getEnemy = function (enemyName) {
	return enemyDictionary[enemyName];
}
