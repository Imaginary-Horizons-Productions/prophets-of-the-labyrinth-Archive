var adventureDictionary = new Map();

exports.loadAdventures = function () {
    //TODO implement
}

exports.getAdventure = function (id) {
    return adventureDictionary.get(id);
}

exports.startAdventure = function (adventure) {
    adventureDictionary.set(adventure.id, adventure);
    //TODO save
}

exports.saveAdventure = function (adventure) {
    //TODO implement
}
