class EngineAssets {
    constructor() {
        this.textFiles = new Map();
        this.jsonFiles = new Map();
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
    
    // Loads a json file and stores it in memory
    loadJsonFile(name, path) {
        return fetch(path)
            .then(response => response.json())
            .then(json => {
                this.jsonFiles.set(name, json);
                return json;
            });
    }

    // Retrieves a loaded json file by name
    getJsonFile(name) {
        return this.jsonFiles.get(name) || null;
    }
}

window.EngineAssets = new EngineAssets();
