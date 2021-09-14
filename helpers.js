const GuildProfile = require("./Classes/GuildProfile.js")
const { getAdventure, completeAdventure } = require("./Data/adventureList.js")
const { saveGuild, getGuild } = require("./Data/guildList.js")
const { getPlayer, setPlayer } = require("./Data/playerList.js")

exports.guildSetup = function (guild) {
    guild.channels.create("Dungeon Tamers", {
        type: "GUILD_CATEGORY"
    }).then(category => {
        guild.channels.create("dungeon-tamers-central", {
            type: "GUILD_TEXT",
            parent: category
        }).then(channel => {
            var guildProfile = getGuild(guild.id);
            if (guildProfile) {
                guildProfile.userIds.forEach(playerId => {
                    var player = getPlayer(playerId, guild.id);
                    player.score[guild.id] = 0;
                    setPlayer(player);
                });
            }
            saveGuild(new GuildProfile(guild.id, category.id, channel.id));
        })
    })
}

exports.dealDamage = function (delver, channel, damage) {
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

exports.healDamage = function (delver, healing) {
    delver.hp += healing;
    if (delver.hp > delver.maxHp) {
        delver.hp = delver.maxHp;
    }
}
