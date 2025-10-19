// This is a temporary file to test celestial asset and sprite creation

window.celestialAssets = window.celestialAssets || [];
window.celestialSprites = window.celestialSprites || [];

// Helper to create an asset + sprite
function createCelestial(options) {
    const asset = new CelestialAsset({ id: options.id });
    asset.setVisibleBody(options.radius, options.mass, options.outerColor, options.innerColor);

    if (options.stationary) {
        asset.setOrbitalStationary(options.x || 0, options.y || 0);
    } else if (options.orbit) {
        asset.setOrbitalBody(options.orbit.parent, options.orbit.height, options.orbit.speed, options.orbit.startAngle || 0, options.orbit.eccentricity || 0);
    }

    // Provide a simple updatePosition implementation if missing
    if (typeof asset.updatePosition !== 'function') {
        asset.updatePosition = function (dt = 0) {
            if (!this.parent) return; // stationary
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

    asset.updatePosition(0);

    const sprite = new CelestialBody({ id: asset.id });
    sprite.x = asset.x;
    sprite.y = asset.y;
    sprite.radius = asset.radius;
    sprite.color = asset.innerColor || asset.outerColor || '#ff0000';
    sprite.sphereOfInfluence = asset.sphereOfInfluence || (asset.radius * 10);

    asset._sprite = sprite;

    window.celestialAssets.push(asset);
    window.celestialSprites.push(sprite);

    return asset;
}

// Build one red stationary planet centered at world (0,0)
const redPlanet = createCelestial({
    id: 'red-planet',
    radius: 60,
    mass: 1000,
    outerColor: '#ff5555',
    innerColor: '#ff0000',
    stationary: true,
    x: 0,
    y: 0
});

// Build one red stationary planet centered at world (0,0)
const bluePlanet = createCelestial({
    id: 'blue-planet',
    radius: 60,
    mass: 1000,
    outerColor: '#0000ff',
    innerColor: '#0000ff',
    stationary: true,
    x: -100,
    y: -100
});

// Export/update helper: sync sprites from assets each frame
window.updateCelestials = function (dt) {
    for (let i = 0; i < window.celestialAssets.length; i++) {
        const a = window.celestialAssets[i];
        if (typeof a.updatePosition === 'function') a.updatePosition(dt);
        const s = a._sprite;
        if (s) {
            s.x = a.x;
            s.y = a.y;
            s.radius = a.radius;
            s.color = a.innerColor || a.outerColor;
            s.sphereOfInfluence = a.sphereOfInfluence || (a.radius * 10);
        }
    }
};

window.createCelestial = createCelestial;
