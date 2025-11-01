class EngineAssets {
    constructor() {
        this.textFiles = new Map();
    }

    // Loads a text file and stores it in memory
    loadTextFile(name, path) {
        return fetch(path)
            .then(response => response.text())
            .then(text => {
                this.textFiles.set(name, text);
                return text;
            });
    }

    // Retrieves a loaded text file by name
    getTextFile(name) {
        return this.textFiles.get(name) || null;
    }
}

window.EngineAssets = new EngineAssets();
