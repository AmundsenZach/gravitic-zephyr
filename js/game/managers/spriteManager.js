import { CelestialSprite } from '../rendering/sprites/celestialSprite.js';

class SpriteManager {
    constructor() {
        this.sprites = [];
        this.spriteMap = new Map(); // asset.id → sprite
    }

    // Create sprites for assets
    createSpritesFor(assets) {
        assets.forEach(asset => {
            // Don't create duplicates
            if (this.spriteMap.has(asset.id)) return;

            const sprite = new CelestialSprite({ id: asset.id });
            
            // Copy visual properties from asset
            sprite.position = asset.position;
            sprite.innerColor = asset.innerColor;
            sprite.outerColor = asset.outerColor;
            sprite.radius = asset.radius;
            sprite.sphereOfInfluence = asset.radius * 10;
            
            // Store reference to asset (for updates)
            sprite.asset = asset;
            
            this.sprites.push(sprite);
            this.spriteMap.set(asset.id, sprite);
        });
    }
    
    // Update sprites from assets (sync visual state)
    update() {
        this.sprites.forEach(sprite => {
            if (sprite.asset) {
                // Read from asset (single source of truth)
                sprite.position = sprite.asset.position;
                sprite.innerColor = sprite.asset.innerColor;
                sprite.outerColor = sprite.asset.outerColor;
                sprite.radius = sprite.asset.radius;
            }
        });
    }
    
    // Destroy specific sprites (for chunk unloading later)
    destroySpritesFor(assets) {
        assets.forEach(asset => {
            const sprite = this.spriteMap.get(asset.id);
            if (sprite) {
                const index = this.sprites.indexOf(sprite);
                if (index > -1) {
                    this.sprites.splice(index, 1);
                }
                this.spriteMap.delete(asset.id);
            }
        });
    }
    
    // Access
    getSprites() {
        return this.sprites;
    }
    
    getSprite(assetId) {
        return this.spriteMap.get(assetId);
    }
    
    // Cleanup
    clear() {
        this.sprites = [];
        this.spriteMap.clear();
    }
}

export { SpriteManager };
