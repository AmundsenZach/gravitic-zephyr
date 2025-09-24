// Creates the planet framework

class CelestialAsset {
    // Hard-coded bodies will be stored in "celestialDebug"
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
        this.parent = null;
    }

    // Creates orbital characteristics of orbiting bodies
    setOrbitalBody(parent, height, speed, startAngle = 0, eccentricity = 0) {
        this.parent = parent;

        // Orbital parameters
        this.height = height; // semi-major axis (pixels)
        this.angularSpeed = speed; // radians per second
        this.angle = (startAngle % 360) * Math.PI / 180; // stored in radians
        this.eccentricity = Math.max(0, Math.min(0.999, eccentricity));

        // initialize position
        this.updatePosition(0);
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
