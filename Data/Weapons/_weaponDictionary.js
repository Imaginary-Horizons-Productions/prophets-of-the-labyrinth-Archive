const fs = require('fs');

var weaponWhitelist = ["dagger.js", "buckler.js"];
const weaponFiles = fs.readdirSync('./Data/Weapons').filter(file => file.endsWith('.js') && weaponWhitelist.includes(file));
exports.weaponDictionary = {};

for (const file of weaponFiles) {
    const weapon = require(`./${file}`);
    exports.weaponDictionary[weapon.name] = weapon;
}
