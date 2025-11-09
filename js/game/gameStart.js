// Game initialization - loads assets and sets up game state
class GameStart {
    static async init() {
        try {
            // Load planets data
            const planetsData = await window.EngineAssets.loadJsonFile('planets', 'json/planets.json');
            
            // Initialize celestial system
            window.celestialSystem = new CelestialUtilities();
            window.celestialSystem.loadFromJSON(planetsData);
            
            // Expose to rendering system
            window.celestialAssets = window.celestialSystem.assets;
            window.celestialSprites = window.celestialSystem.sprites;
            
            // Create spacecraft
            window.spacecraftAsset = new SpacecraftAsset(new MathUtilities.Vector2(0, -200));
            window.spacecraftAsset.rotation = Math.PI / 2;
            
            window.spacecraftSprite = new SpacecraftSprite(window.spacecraftAsset);
            window.spacecraftSprites = [window.spacecraftSprite];
            
            // Setup camera to follow spacecraft
            if (window.Rendering && window.Rendering.camera) {
                window.Rendering.camera.setTarget(window.spacecraftAsset);
                window.Rendering.camera.setFollowing(true);
            }
            
            // Setup update loop for celestials
            window.engineEvent.on('gameTick', (data) => {
                const dt = data.deltaTime / 1000; // Convert ms to seconds
                window.celestialSystem.update(dt);
            });
            
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}

window.GameStart = GameStart;
