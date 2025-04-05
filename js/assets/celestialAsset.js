// Creates the planet framework

class CelestialAsset {
    // Configurations are currently stored in "celestialDebug"
    constructor(config) {
        this.id = config.id; // Identifying name of body
    }

    // Creates a visible body
    setVisibleBody(radius, mass, outerColor, innerColor) {
        // Base body characteristics
        this.radius = radius;
        this.mass = mass;

        // Base visual characteristics
        this.outerColor = outerColor; // Color of crust
        this.innerColor = innerColor; // Color of body
    }

    // Sets the position of stationary bodies (like a star)
    setOrbitalStationary(x, y) {
        this.x = x;
        this.y = y;
    }

    // Creates orbital characteristics of orbiting bodies
    setOrbitalBody(parent, height, speed, angle, eccentricity) {
        this.parent = parent;
        this.height = height;
        this.speed = speed;
        this.angle = angle;
        this.eccentricity = eccentricity;
    }

    // Returns the position of body, for parent-child coordination
    getOrbitalPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
}

window.CelestialAsset = CelestialAsset;
