class CelestialUtilities {
    constructor() {
        this.assets = [];
        this.sprites = [];
        this.assetMap = new Map(); // ID -> asset lookup
    }

    // Load celestials from JSON data
    loadFromJSON(jsonData) {
        const celestials = jsonData.celestials || [];
        
        // First pass: create all assets
        celestials.forEach(data => {
            const asset = new CelestialAsset({ id: data.id });
            asset.name = data.name;
            asset.setVisibleBody(data.radius, data.mass, data.color, data.color);
            
            // Store for parent resolution
            this.assetMap.set(data.id, asset);
            this.assets.push(asset);
            
            // Temporarily store the raw data for second pass
            asset._rawData = data;
        });
        
        // Second pass: set up positions/orbits (now all parents exist)
        this.assets.forEach(asset => {
            const data = asset._rawData;
            
            if (data.stationary) {
                asset.setOrbitalStationary(data.x || 0, data.y || 0);
            } else if (data.orbit) {
                const parent = this.assetMap.get(data.orbit.parentId);
                if (parent) {
                    asset.setOrbitalBody(
                        parent,
                        data.orbit.height,
                        data.orbit.speed,
                        data.orbit.startAngle || 0,
                        data.orbit.eccentricity || 0
                    );
                } else {
                    console.warn(`Parent ${data.orbit.parentId} not found for ${data.id}`);
                }
            }
            
            // Add updatePosition if missing
            if (typeof asset.updatePosition !== 'function') {
                asset.updatePosition = function(dt = 0) {
                    if (!this.parent) return;
                    if (this.angularSpeed) this.angle += this.angularSpeed * dt;
                    const a = this.height;
                    const e = this.eccentricity || 0;
                    const b = a * Math.sqrt(1 - e * e);
                    const px = this.parent.x || 0;
                    const py = this.parent.y || 0;
                    this.x = px + a * Math.cos(this.angle);
                    this.y = py + b * Math.sin(this.angle);
                };
            }
            
            // Initialize position
            asset.updatePosition(0);
            
            // Create sprite
            const sprite = new CelestialSprite({ id: asset.id });
            sprite.x = asset.x;
            sprite.y = asset.y;
            sprite.radius = asset.radius;
            sprite.color = asset.innerColor || asset.outerColor; // Use innerColor first, fallback to outerColor
            sprite.sphereOfInfluence = asset.sphereOfInfluence || (asset.radius * 10);
            
            asset._sprite = sprite;
            this.sprites.push(sprite);
            
            // Clean up temp data
            delete asset._rawData;
        });
        
        return this;
    }
    
    // Update all celestial positions and sync to sprites
    update(dt) {
        this.assets.forEach(asset => {
            if (typeof asset.updatePosition === 'function') {
                asset.updatePosition(dt);
            }
            
            const sprite = asset._sprite;
            if (sprite) {
                sprite.x = asset.x;
                sprite.y = asset.y;
                sprite.radius = asset.radius;
                sprite.color = asset.innerColor || asset.outerColor; // Use innerColor first, fallback to outerColor
                sprite.sphereOfInfluence = asset.sphereOfInfluence || (asset.radius * 10);
            }
        });
    }
    
    // Get asset by ID
    getAsset(id) {
        return this.assetMap.get(id);
    }
    
    // Get asset by name
    getAssetByName(name) {
        return this.assets.find(a => a.name === name);
    }
}

window.CelestialUtilities = CelestialUtilities;
