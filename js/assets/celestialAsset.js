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
        //this.eccentricity = Math.max(0, Math.min(0.999, eccentricity));

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

    // Updates the position of orbiting bodies based on time
    updatePosition(dt) {
        // Stationary bodies don't move
        if (!this.parent) return;
        
        // Update angle based on angular speed
        if (this.angularSpeed) {
            this.angle += this.angularSpeed * dt;
        }
        
        // Calculate elliptical orbit
        const a = this.height; // semi-major axis
        const e = this.eccentricity || 0; // eccentricity
        const b = a * Math.sqrt(1 - e * e); // semi-minor axis
        
        // Get parent position
        const px = this.parent.x || 0;
        const py = this.parent.y || 0;
        
        // Calculate position on ellipse
        this.x = px + a * Math.cos(this.angle);
        this.y = py + b * Math.sin(this.angle);
    }
}

window.CelestialAsset = CelestialAsset;
