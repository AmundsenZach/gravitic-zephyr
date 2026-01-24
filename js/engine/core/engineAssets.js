class EngineAssets {
    static jsonFiles = new Map();

    // Loads a json file and stores it in memory
    static loadJsonFile(name, path) {
        return fetch(path)
            .then(response => response.json())
            .then(json => {
                this.jsonFiles.set(name, json);
                return json;
            });
    }

    // Retrieves a loaded json file by name
    static getJsonFile(name) {
        return this.jsonFiles.get(name) || null;
    }
}

export { EngineAssets };
