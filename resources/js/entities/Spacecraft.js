class Spacecraft {
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

    // Render spacecraft and engine effects
    draw(ctx, camera) {
        // Update and draw thrust particles
        this.thrustHistory.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
        
            // Convert to screen coordinates
            const screenX = (particle.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
            const screenY = (particle.y - camera.y) * camera.zoom + ctx.canvas.height / 2;
        
            // Fade out particle over time
            const opacity = particle.life / 15;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.size * camera.zoom, 0, Math.PI * 2);
            ctx.fill();
        
            particle.life -= 0.7;
        });

        // Remove dead particles
        this.thrustHistory = this.thrustHistory.filter(p => p.life > 0);

        // Draw spacecraft triangle
        const screenX = (this.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
    
        // Change color to red if crashed
        ctx.strokeStyle = this.crashed ? 'red' : 'white';
        ctx.lineWidth = 2;
    
        // Draw triangular spacecraft shape
        ctx.beginPath();
        ctx.moveTo(10 * camera.zoom, 0);
        ctx.lineTo(-5 * camera.zoom, 5 * camera.zoom);
        ctx.lineTo(-5 * camera.zoom, -5 * camera.zoom);
        ctx.closePath();
        ctx.stroke();

        // Add glow effect if not crashed
        if (!this.crashed) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

window.Spacecraft = Spacecraft;
