class EngineAssets {
    constructor() {
        this.jsonFiles = new Map();
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
