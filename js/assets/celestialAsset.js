// Creates the planet framework

class CelestialAsset {
    // Hard-coded bodies are currently stored in "celestialDebug"
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

        // Orbital parameters
        this.height = height;
        this.speed = speed;
        
        // Angle is a value 0 to 359 of a starting position
        // 90 is directly right of the parent
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
