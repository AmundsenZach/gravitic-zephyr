import { EngineAssets } from '../../engine/core/engineAssets.js';
import { EngineEvent } from '../../engine/core/engineEvent.js';
import { AssetManager } from '../managers/assetManager.js';
import { SpriteManager } from '../managers/spriteManager.js';
import { SimulationManager } from '../managers/simulationManager.js';

// Export manager instances for use in other modules
export let simulationManager;
export let celestialSprites;

class GameStart {
    static async init() {
        try {
            const planetsData = await EngineAssets.loadJsonFile('planets', 'json/planets.json');

            simulationManager = new SimulationManager(); // Remove singleton instance

            const assets = AssetManager.loadFromJSON(planetsData);
            simulationManager.init(assets);

            // Calculate initial positions before creating sprites
            simulationManager.update(0);

            SpriteManager.createSpritesFor(assets);

            EngineEvent.on('gameTick', (data) => {
                const dt = data.deltaTime / 1000;

                simulationManager.update(dt);
                SpriteManager.update();
            });

            celestialSprites = SpriteManager.getSprites();
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}

export { GameStart };
