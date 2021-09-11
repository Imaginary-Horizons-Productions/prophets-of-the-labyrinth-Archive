var fs = require("fs");

var filePath = "./Saves/guilds.json";
var guildDictionary = new Map();

exports.loadGuilds = function () {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            var guildProfiles = require(filePath);
            guildProfiles.forEach(guildProfile => {
                guildDictionary.set(guildProfile.id, guildProfile);
            })
            resolve();
        } else {
            if (!fs.existsSync("./Saves")) {
                fs.mkdirSync("./Saves", { recursive: true });
            }
            fs.writeFile(filePath, "[]", "utf8", error => {
                if (error) {
                    console.error(error);
                }
            })
            resolve();
        }
    })
}

exports.getGuild = function (guildId) {
    return guildDictionary.get(guildId);
}

exports.saveGuild = function (guildProfile) { //TODO convert to set/save pattern in adventureDictionary to allow save after removal of guild
    guildDictionary.set(guildProfile.id, guildProfile);
    if (!fs.existsSync("./Saves")) {
        fs.mkdirSync("./Saves", { recursive: true });
    }
    fs.writeFile(filePath, JSON.stringify(Array.from((guildDictionary.values()))), "utf8", error => {
        if (error) {
            console.error(error);
        }
    })
}
