class CelestialAsset {
    constructor(config) {
        this.id = config.id; // Identifying name of body
        this.name = config.name;
        this.mass = config.mass;
    }

    // Creates a visible body
    setVisibleBody(outerColor, innerColor, radius) {
        this.outerColor = outerColor; // Color of crust and SOI
        this.innerColor = innerColor; // Color of body
        this.radius = radius; // Visual radius (pixels)
    }

    // Sets the position of stationary bodies (like a star)
    setOrbitalStationary(position) {
        this.parentId = null;
        this.position = position; // Vector2 position
    }

    // Creates orbital characteristics of orbiting bodies
    setOrbitalBody(parentId, semiMajorAxis, argumentOfPeriapsis, eccentricity, meanAnomaly) {
        this.parentId = parentId;

        this.semiMajorAxis = semiMajorAxis;
        this.argumentOfPeriapsis = MathUtilities.Operations.convertToRadians(argumentOfPeriapsis); // Converted and stored in radians
        this.eccentricity = eccentricity || 0; // Default to circular if no value provided
        this.meanAnomaly = MathUtilities.Operations.convertToRadians(meanAnomaly); // Converted and stored in radians
    }

    // Returns the position of body, for parent-child coordination
    getOrbitalPosition() {
        return {
            position: this.position
        }
    }

    // Updates the position of orbiting bodies based on time
    updatePosition(dt) {
        // Stationary bodies don't move
        if (!this.parentId) return;

        // Update angle based on angular speed
        if (this.angularSpeed) {
            this.angle += this.angularSpeed * dt;
        }

        this.position = this.parentId.position;
    }
}

window.CelestialAsset = CelestialAsset;
