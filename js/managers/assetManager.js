class AssetManager {
    constructor() {
        this.assets = [];
        this.assetMap = new Map(); // id → asset
    }
    
    // Load assets from JSON
    loadFromJSON(jsonData) {
        const celestials = jsonData.celestials || [];
        
        // First pass: Create all assets
        celestials.forEach(data => {
            const asset = new CelestialAsset({
                id: data.id,
                name: data.name,
                mass: data.mass
            });
            
            // ADD THIS: Set visual properties
            if (data.setVisibleBody) {
                asset.setVisibleBody(
                    data.setVisibleBody.outerColor,
                    data.setVisibleBody.innerColor,
                    data.setVisibleBody.radius
                );
            }

            this.assets.push(asset);
            this.assetMap.set(asset.id, asset);
        });
        
        // Second pass: Link parents (now all exist)
        celestials.forEach((data, index) => {
            const asset = this.assets[index];
            
            if (data.setOrbitalStationary) {
                asset.setOrbitalStationary(
                    new VectorUtilities(data.setOrbitalStationary.x, data.setOrbitalStationary.y)
                );
            } else if (data.setOrbitalBody) {
                const parent = this.assetMap.get(data.setOrbitalBody.parentId);
                asset.setOrbitalBody(
                    parent,
                    data.setOrbitalBody.semiMajorAxis,
                    data.setOrbitalBody.argumentOfPeriapsis || 0,
                    data.setOrbitalBody.eccentricity || 0,
                    data.setOrbitalBody.meanAnomaly || 0
                );
            }
            
            // Initialize position
            //asset.updatePosition(0);
        });
        
        return this.assets;
    }
    
    // Update all assets (physics)
    update(dt) {
        this.assets.forEach(asset => {
            if (typeof asset.updatePosition === 'function') {
                asset.updatePosition(dt);
            }
        });
    }

    // Access
    getAssets() {
        return this.assets;
    }

    getAsset(id) {
        return this.assetMap.get(id);
    }

    // Cleanup (for reset/reload)
    clear() {
        this.assets = [];
        this.assetMap.clear();
    }
}

window.AssetManager = AssetManager;
