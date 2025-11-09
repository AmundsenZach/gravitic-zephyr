class CelestialAsset {
    constructor(config) {
        this.id = config.id; // Identifying name of body
        this.name = config.name;
        this.mass = config.mass;
    }

    // Creates a visible body
    setVisibleBody(outerColor, innerColor, radius) {
        // Base visual characteristics
        this.outerColor = outerColor; // Color of crust and SOI
        this.innerColor = innerColor; // Color of body
        this.radius = radius; // Visual radius (pixels)
    }

    // Sets the position of stationary bodies (like a star)
    setOrbitalStationary(assetVector) {
        // No parent body
        this.parentId = null;

        // Direct position assignment
        this.assetVector = assetVector; // Vector2 position
    }

    // Creates orbital characteristics of orbiting bodies
    setOrbitalBody(parentId, semiMajorAxis, argumentOfPeriapsis, eccentricity, meanAnomaly) {
        // Parent body - can reference another orbiting body
        this.parentId = parentId;

        // Orbital characteristics for elliptical orbits
        this.semiMajorAxis = semiMajorAxis;
        this.argumentOfPeriapsis = MathUtilities.Operations.convertToRadians(argumentOfPeriapsis); // Converted and stored in radians
        this.eccentricity = eccentricity;
        this.meanAnomaly = MathUtilities.Operations.convertToRadians(meanAnomaly); // Converted and stored in radians
    }

    // Returns the position of body, for parent-child coordination
    getOrbitalPosition() {
        return {
            assetVector: this.assetVector
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

        // Calculate elliptical orbit TODO cleanup
        const offset = MathUtilities.Vector2.fromAngle(this.argumentOfPeriapsis, this.semiMajorAxis);
        offset.y *= MathUtilities.Operations.offset(this.eccentricity);
        this.assetVector = MathUtilities.Vector2.add(this.parentId, offset);
    }
}

window.CelestialAsset = CelestialAsset;
