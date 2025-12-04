class GameStart {
    static async init() {
        try {
            const planetsData = await window.EngineAssets.loadJsonFile('planets', 'json/planets.json');
            
            window.assetManager = new AssetManager();
            window.spriteManager = new SpriteManager();
            window.simulationManager = new SimulationManager();
            
            const assets = window.assetManager.loadFromJSON(planetsData);
            window.simulationManager.init(assets);

            // Calculate initial positions before creating sprites
            window.simulationManager.update(0);

            window.spriteManager.createSpritesFor(assets);
            
            window.engineEvent.on('gameTick', (data) => {
                const dt = data.deltaTime / 1000;

                window.simulationManager.update(dt);
                window.spriteManager.update();
            });
            
            window.celestialSprites = window.spriteManager.getSprites();
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}

window.GameStart = GameStart;
