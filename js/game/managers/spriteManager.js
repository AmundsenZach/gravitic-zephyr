import { CelestialSprite } from '../rendering/sprites/celestialSprite.js';

class SpriteManager {
    static sprites = [];
    static spriteMap = new Map(); // asset.id → sprite

    // Create sprites for assets
    static createSpritesFor(assets) {
        assets.forEach(asset => {
            // Don't create duplicates
            if (SpriteManager.spriteMap.has(asset.id)) return;

            const sprite = new CelestialSprite({ id: asset.id });
            
            // Copy visual properties from asset
            sprite.position = asset.position;
            sprite.innerColor = asset.innerColor;
            sprite.outerColor = asset.outerColor;
            sprite.radius = asset.radius;
            sprite.sphereOfInfluence = asset.radius * 10;
            
            // Store reference to asset (for updates)
            sprite.asset = asset;
            
            SpriteManager.sprites.push(sprite);
            SpriteManager.spriteMap.set(asset.id, sprite);
        });
    }
    
    // Update sprites from assets (sync visual state)
    static update() {
        SpriteManager.sprites.forEach(sprite => {
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
    static destroySpritesFor(assets) {
        assets.forEach(asset => {
            const sprite = SpriteManager.spriteMap.get(asset.id);
            if (sprite) {
                const index = SpriteManager.sprites.indexOf(sprite);
                if (index > -1) {
                    SpriteManager.sprites.splice(index, 1);
                }
                SpriteManager.spriteMap.delete(asset.id);
            }
        });
    }
    
    // Access
    static getSprites() {
        return SpriteManager.sprites;
    }
    
    static getSprite(assetId) {
        return SpriteManager.spriteMap.get(assetId);
    }
    
    // Cleanup
    static clear() {
        SpriteManager.sprites = [];
        SpriteManager.spriteMap.clear();
    }
}

export { SpriteManager };
