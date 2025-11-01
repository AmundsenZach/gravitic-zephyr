class SpacecraftAsset {
    // Initialize spacecraft with position and movement properties
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;                    // Velocity X component
        this.vy = 0;                    // Velocity Y component
        this.rotation = 0;              // Current rotation angle
        this.thrustPower = 0.0005;      // Engine power
        this.rotationSpeed = 0.03;      // Turn rate
        this.thrustHistory = [];        // Array tracking engine particles
        this.crashed = false;           // Crash state
    }

    // Update spacecraft physics and state
    update(planets, timeWarp) {
        if (this.crashed) return;

        // Check gravitational influence of each planet
        for (const planet of planets) {
            // Check for collision with planet
            if (planet.checkCollision(this)) {
                this.crashed = true;
                UIManager.updateStatus('Crashed!');
                return;
            }

            // Calculate gravitational force

            const shipPos = new MathUtilities.Vector2(this.x, this.y);
            const planetPos = new MathUtilities.Vector2(planet.x, planet.y);
            const delta = MathUtilities.Vector2.subtract(planetPos, shipPos); // vector from ship -> planet
            const distance = delta.length();

            if (distance > 0) {
                const force = (planet.mass / (distance * distance)) * 0.01 * timeWarp;
                const accel = delta.normalize().multiply(force); // acceleration vector
                this.vx += accel.x;
                this.vy += accel.y;
            }

        }

        // Update position based on velocity
        this.x += MathUtilities.Vector2.multiply(new MathUtilities.Vector2(this.vx, this.vy), timeWarp).x;
        this.y += MathUtilities.Vector2.multiply(new MathUtilities.Vector2(this.vx, this.vy), timeWarp).y;

        // Calculate and display current velocity
        const orbitalVelocity = new MathUtilities.Vector2(this.vx, this.vy).length();
        UIManager.updateOrbitalVelocity(orbitalVelocity);

        // Find distance to nearest planet surface
        let closestDistance = Infinity;
        for (const planet of planets) {
            const distance = MathUtilities.Vector2.distance(
                new MathUtilities.Vector2(this.x, this.y),
                new MathUtilities.Vector2(planet.x, planet.y)
            ) - planet.radius;

            if (distance < closestDistance) {
                closestDistance = distance;
            }
        }

        UIManager.updateAltitude(closestDistance);
    }

    // Add engine exhaust particle effect
    addThrustParticle() {
        if (this.crashed) return;

        // Limit number of particles
        if (this.thrustHistory.length > 12) this.thrustHistory.shift();
    
        // Calculate random variations for particle
        const randomSpeed = 2 + Math.random();
        const randomOffset = (Math.random() - 0.5) * 0.2;
    
        // Add new particle with position, velocity and lifetime
        this.thrustHistory.push({
            x: this.x - Math.cos(this.rotation) * 7,
            y: this.y - Math.sin(this.rotation) * 7,
            vx: -Math.cos(this.rotation + randomOffset) * randomSpeed,
            vy: -Math.sin(this.rotation + randomOffset) * randomSpeed,
            life: 15,
            size: 2 + Math.random()
        });
    }
}

window.SpacecraftAsset = SpacecraftAsset;
