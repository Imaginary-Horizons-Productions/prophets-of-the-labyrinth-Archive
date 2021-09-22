// Represents a player's information specific to a specific delve including: delve id, difficulty options, character selected, stats, weapons and upgrades, and artifacts
module.exports = class Delver {
    constructor (idInput, adventureIdInput) {
        this.id = idInput;
        this.adventureId = adventureIdInput;
        this.difficultyOptions = [];
        this.name = "Placeholder";
        this.hp = 10;
        this.maxHp = 30;
        this.readType = "targets";
        this.weapons = [];
    }
}

module.exports.prototype.takeDamage = (channel, damage) => {
    delver.hp -= damage;
    if (delver.hp <= 0) {
        delver.hp = delver.maxHp;
        let adventure = getAdventure(channel.id);
        adventure.lives -= 1;
        channel.send(`<@${delver.id}> has died and been revived. ${adventure.lives} lives remain.`)
        if (adventure.lives <= 0) {
            return completeAdventure(adventure, channel, "defeat");
        }
    }
    return;
}
