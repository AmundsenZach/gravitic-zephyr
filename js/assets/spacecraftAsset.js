class SpacecraftAsset {
    // Initialize spacecraft with position and movement properties
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;                    // Velocity X component
        this.vy = 0;                    // Velocity Y component
        this.rotation = 0;              // Current rotation angle
        this.thrustPower = 0.001;       // Engine power
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
            const dx = planet.x - this.x;
            const dy = planet.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = (planet.mass / (distance * distance)) * 0.01 * timeWarp;
            const angle = Math.atan2(dy, dx);
        
            // Apply gravitational acceleration
            this.vx += Math.cos(angle) * force;
            this.vy += Math.sin(angle) * force;
        }

        // Update position based on velocity
        this.x += this.vx * timeWarp;
        this.y += this.vy * timeWarp;

        // Calculate and display current velocity
        const orbitalVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        UIManager.updateOrbitalVelocity(orbitalVelocity);

        // Find distance to nearest planet surface
        let closestDistance = Infinity;
        for (const planet of planets) {
            const dx = planet.x - this.x;
            const dy = planet.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy) - planet.radius;
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
