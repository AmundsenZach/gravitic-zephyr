class CelestialAsset {
    constructor(config) {
        this.id = config.id; // Identifying name of body
        this.name = config.name;
        this.mass = config.mass;
    }

    // Creates a visible body
    setVisibleBody(outerColor, innerColor, radius) {
        this.outerColor = outerColor;
        this.innerColor = innerColor;
        this.radius = radius;

        // Approximate sphere of influence as 10x radius
        this.sphereOfInfluence = radius * 10;
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
        this.argumentOfPeriapsis = MathUtilities.convertToRadians(argumentOfPeriapsis); // Converted and stored in radians
        this.eccentricity = eccentricity || 0; // Default to circular if no value provided
        this.meanAnomaly = MathUtilities.convertToRadians(meanAnomaly); // Converted and stored in radians
    }

    // Returns the position of body, for parent-child coordination
    getOrbitalPosition() {
        return {
            position: this.position
        }
    }
}

window.CelestialAsset = CelestialAsset;
