import { engineAssets } from '../../engine/core/engineAssets.js';
import { engineEvent } from '../../engine/core/engineEvent.js';
import { AssetManager } from '../managers/assetManager.js';
import { SpriteManager } from '../managers/spriteManager.js';
import { SimulationManager } from '../managers/simulationManager.js';

// Export manager instances for use in other modules
export let assetManager;
export let spriteManager;
export let simulationManager;
export let celestialSprites;

class GameStart {
    static async init() {
        try {
            const planetsData = await engineAssets.loadJsonFile('planets', 'json/planets.json');

            assetManager = new AssetManager();
            spriteManager = new SpriteManager();
            simulationManager = new SimulationManager();

            const assets = assetManager.loadFromJSON(planetsData);
            simulationManager.init(assets);

            // Calculate initial positions before creating sprites
            simulationManager.update(0);

            spriteManager.createSpritesFor(assets);

            engineEvent.on('gameTick', (data) => {
                const dt = data.deltaTime / 1000;

                simulationManager.update(dt);
                spriteManager.update();
            });

            celestialSprites = spriteManager.getSprites();
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}

export { GameStart };
