// Creates the planet framework

class celestialAsset {
    // Configurations are currently stored in "celestialDebug"
    constructor(config) {
        // Identification
        this.id = config.id; // Identifying name of body
    }

    // Creates a visible planet
    setVisibleBody(radius, mass, outerColor, innerColor) {
        // Base Planetary Characteristics
        this.radius = radius;
        this.mass = mass;

        // Visual Planetary Characteristics
        this.outerColor = outerColor; // Color of crust
        this.innerColor = innerColor; // Color of body
    }

    // Sets the position of stationary bodies (like a star)
    setOrbitalStationary(x, y) {
        this.x = x;
        this.y = y;
    }

    setOrbitalBody(parent, height, speed, angle, eccentricity) {
        this.parent = parent;
        this.height = height;
        this.speed = speed;
        this.angle = angle;
        this.eccentricity = eccentricity;
    }

    getOrbitalPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
