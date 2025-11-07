class CelestialUtilities {
    constructor() {
        this.assets = [];
        this.sprites = [];
        this.assetMap = new Map(); // ID -> asset lookup
        this.spriteMap = new Map(); // asset -> sprite lookup
    }

    // Load celestials from JSON data
    loadFromJSON(jsonData) {
        const celestials = jsonData.celestials || [];
        
        // First pass: create all assets
        celestials.forEach(data => {
            const asset = new CelestialAsset({id: data.id});
            asset.name = data.name;
            asset.setVisibleBody(data.radius, data.mass, data.outerColor, data.innerColor);

            // Store for parent resolution
            this.assetMap.set(data.id, asset);
            this.assets.push(asset);
        });

        // Second pass: set up positions/orbits (now all parents exist)
        celestials.forEach((data, index) => {
            const asset = this.assets[index];

            if (data.stationary) {
                asset.setOrbitalStationary(data.x || 0, data.y || 0);
            } else if (data.orbit) {
                const parent = this.assetMap.get(data.orbit.parentId);
                if (parent) {
                    asset.setOrbitalBody(
                        parent,
                        data.orbit.height,
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
                    if (!this.parent) {
                        return;
                    }

                    if (this.angularSpeed) {
                        this.angle += this.angularSpeed * dt;
                    }

                    const b = this.height * Math.sqrt(1 - this.eccentricity ** 2);

                    const px = this.parent.x || 0;
                    const py = this.parent.y || 0;

                    this.x = px + this.height * Math.cos(this.angle);
                    this.y = py + b * Math.sin(this.angle);
                };
            }

            // Initialize position
            asset.updatePosition(0);

            // Create sprite and link it to the asset
            const sprite = new CelestialSprite({ id: asset.id });

            sprite.x = asset.x;
            sprite.y = asset.y;

            sprite.innerColor = asset.innerColor;
            sprite.outerColor = asset.outerColor;

            sprite.radius = asset.radius;
            sprite.sphereOfInfluence = asset.sphereOfInfluence || (asset.radius * 10);

            this.sprites.push(sprite);
            this.spriteMap.set(asset, sprite);
        });

        return this;
    }

    // Update all celestial positions and sync to sprites
    update(dt) {
        this.assets.forEach(asset => {
            if (typeof asset.updatePosition === 'function') {
                asset.updatePosition(dt);
            }

            const sprite = this.spriteMap.get(asset);
            if (sprite) {
                sprite.x = asset.x;
                sprite.y = asset.y;

                sprite.outerColor = asset.outerColor;
                sprite.innerColor = asset.innerColor;

                sprite.radius = asset.radius;
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

    // Get sprite for an asset
    getSprite(asset) {
        return this.spriteMap.get(asset);
    }
}

window.CelestialUtilities = CelestialUtilities;
