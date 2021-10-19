var enemyWhitelist = [
	"brute.js",
	"mirrorclone.js"
];

const enemyDictionary = {};

for (const file of enemyWhitelist) {
	const enemy = require(`./${file}`);
	enemyDictionary[enemy.name] = enemy;
}

exports.getEnemy = (enemyName) => {
	return enemyDictionary[enemyName];
}
