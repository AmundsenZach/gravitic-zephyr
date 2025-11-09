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
            const asset = new CelestialAsset({ id: data.id });
            asset.name = data.name;

            this.assetMap.set(data.id, asset);
            this.assets.push(asset);

            if (data.setVisibleBody) {
                asset.setVisibleBody(
                    data.setVisibleBody.outerColor,
                    data.setVisibleBody.innerColor,
                    data.setVisibleBody.radius
                );
            }
        });

        // Second pass: set up positions/orbits (now all parents exist)
        celestials.forEach((data, index) => {
            const asset = this.assets[index];

            if (data.setOrbitalStationary) {
                asset.setOrbitalStationary(
                    new MathUtilities.Vector2(
                        data.setOrbitalStationary.x,
                        data.setOrbitalStationary.y
                    )
                );
            } else if (data.setOrbitalBody) {
                const parentAsset = this.assetMap.get(data.setOrbitalBody.parentId);
                if (parentAsset) {
                    asset.setOrbitalBody(
                        parentAsset,
                        data.setOrbitalBody.semiMajorAxis,
                        data.setOrbitalBody.argumentOfPeriapsis || 0,
                        data.setOrbitalBody.eccentricity || 0,
                        data.setOrbitalBody.meanAnomaly || 0
                    );
                } else {
                    console.warn(`Parent ${data.setOrbitalBody.parentId} not found for ${data.id}`);
                }
            }

            // Add updatePosition if missing
            if (typeof asset.updatePosition !== 'function') {
                asset.updatePosition = function(dt = 0) {
                    // Require an actual parent asset object
                    if (!this.parent) return;
                    if (this.angularSpeed) this.angle += this.angularSpeed * dt;
                    // Calculate position in orbit as a Vector2
                };
            }

            // Initialize position
            asset.updatePosition(0);

            // Create sprite and link it to the asset
            const sprite = new CelestialSprite({ id: asset.id });

            // Convert to Vector2 - use the asset's utilitiesVector (vector-first)
            sprite.position = asset.position;

            sprite.innerColor = asset.innerColor;
            sprite.outerColor = asset.outerColor;
            sprite.radius = asset.radius;

            sprite.sphereOfInfluence = asset.radius * 10;

            this.sprites.push(sprite);
            this.spriteMap.set(asset, sprite);
        });

        return this;
    }

    // Update all celestial positions and sync to sprites
    update(dt) {
        this.assets.forEach(asset => {
            if (typeof asset.updatePosition === 'function') asset.updatePosition(dt);

            const sprite = this.spriteMap.get(asset);

            if (sprite) {
                // use the vector representation instead of direct x/y
                sprite.position = asset.position;

                sprite.outerColor = asset.outerColor;
                sprite.innerColor = asset.innerColor;

                sprite.radius = asset.radius;
                sprite.sphereOfInfluence = asset.radius * 10;
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
