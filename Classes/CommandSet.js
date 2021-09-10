// Command Linking Class
module.exports = class CommandSet {
    constructor(nameInput, descriptionInput, cullforNonManagers, fileNamesInput) {
        this.name = nameInput;
        this.description = descriptionInput;
        this.managerCommands = cullforNonManagers;
        this.fileNames = fileNamesInput;
    }
}
