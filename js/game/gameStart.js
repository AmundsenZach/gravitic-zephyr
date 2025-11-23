class GameStart {
    static async init() {
        try {
            // Load JSON
            const planetsData = await window.EngineAssets.loadJsonFile('planets', 'json/planets.json');
            
            // Create managers
            window.assetManager = new AssetManager();
            window.spriteManager = new SpriteManager();
            
            // Load assets (game state)
            const assets = window.assetManager.loadFromJSON(planetsData);
            
            // Create sprites for those assets (visuals)
            window.spriteManager.createSpritesFor(assets);
            
            // Setup update loop
            window.engineEvent.on('gameTick', (data) => {
                const dt = data.deltaTime / 1000;

                // Update physics
                window.assetManager.update(dt);

                // Sync sprites to assets
                window.spriteManager.update();
            });
            
            // Expose for rendering
            window.celestialSprites = window.spriteManager.getSprites();

            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}

window.GameStart = GameStart;
