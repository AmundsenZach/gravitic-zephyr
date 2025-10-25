// Class responsible for predicting spacecraft orbital paths and identifying gravitational influences
class OrbitPredictor {
    // Initialize predictor with default settings for accuracy and visualization
    constructor() {
        // Array to store predicted future positions of spacecraft
        this.positions = [];
            
        // Current calculated orbital period in game units
        this.orbitalPeriod = 0;
            
        // Number of points to calculate per orbit
        // Higher values give smoother predictions but cost more performance
        this.predictionQuality = 2000;
            
        // Number of complete orbits to predict ahead
        // More orbits show longer-term behavior but require more calculation
        this.targetOrbits = 5;
            
        // Array to store points where spacecraft transitions between gravity wells
        // Used for visualizing sphere of influence changes
        this.transitionPoints = [];
    }

    // Determine which celestial body has the strongest gravitational influence at a given point
    calculateDominantBody(x, y, planets) {
        // Create position vector for the point we're checking
        const position = new MathUtilities.Vector2(x, y);
        
        // First check the smaller orbiting planet (moon/satellite)
        // It takes priority within its sphere of influence despite lower mass
        const smallPlanet = planets.find(p => p.isOrbiting);
        if (smallPlanet) {
            // Calculate distance to the orbiting body
            const planetPos = new MathUtilities.Vector2(smallPlanet.x, smallPlanet.y);
            const distance = position.distance(planetPos);
                
            // If point is within sphere of influence, this body dominates
            // regardless of the main planet's pull
            if (distance <= smallPlanet.sphereOfInfluence) {
                return smallPlanet;
            }
        }

        // Then check the main non-orbiting planet (primary body)
        const mainPlanet = planets.find(p => !p.isOrbiting);
        if (mainPlanet) {
            // Calculate distance to the main body
            const planetPos = new MathUtilities.Vector2(mainPlanet.x, mainPlanet.y);
            const distance = position.distance(planetPos);
                
            // If point is within main planet's sphere of influence,
            // it dominates (unless already in smaller body's SOI)
            if (distance <= mainPlanet.sphereOfInfluence) {
                return mainPlanet;
            }
        }

        // If not in any sphere of influence, find closest body
        // This is a fallback for edge cases and very distant points
        let closest = null;
        let minDistance = Infinity;
        
        // Check each planet and find the nearest one
        for (const planet of planets) {
            const planetPos = new MathUtilities.Vector2(planet.x, planet.y);
            const distance = position.distance(planetPos);
            
            // Update closest if this planet is nearer than previous
            if (distance < minDistance) {
                minDistance = distance;
                closest = planet;
            }
        }
            
        // Return the closest planet as dominant body
        // This ensures we always have a gravitational reference
        return closest;
    }

    // Calculate the orbital period of the spacecraft around a body using Kepler's Third Law
    calculateOrbitalPeriod(spacecraft, planets) {
        // Find the planet with strongest gravitational influence on spacecraft
        let dominantPlanet = null;
        let strongestGravity = 0;
        
        // Create position vector for spacecraft
        const spacecraftPos = new MathUtilities.Vector2(spacecraft.x, spacecraft.y);
        
        // Check gravitational force from each planet
        for (const planet of planets) {
            // Calculate distance to planet
            const planetPos = new MathUtilities.Vector2(planet.x, planet.y);
            const distance = spacecraftPos.distance(planetPos);

            // Calculate gravitational force using inverse square law
            const gravity = planet.mass / (distance * distance);
            
            // Update dominant planet if gravity is stronger
            if (gravity > strongestGravity) {
                strongestGravity = gravity;
                dominantPlanet = planet;
            }
        }

        // Return large period if no dominant body found (effectively straight path)
        if (!dominantPlanet) return 50000;

        // Calculate distance to dominant planet
        const planetPos = new MathUtilities.Vector2(dominantPlanet.x, dominantPlanet.y);
        const distance = spacecraftPos.distance(planetPos);

        // Calculate orbital period using Kepler's Third Law: T = 2π√(r³/GM)
        // 0.01 factor adjusts mass to match game physics scale
        const period = 2 * Math.PI * Math.sqrt((distance * distance * distance) / (dominantPlanet.mass * 0.01));
        UIManager.updateOrbitalPeriod(period);
        return period;
    }

    // Predict future orbital path of spacecraft considering gravity from multiple bodies
    predict(spacecraft, planets, timeWarp) {
        // Reset prediction arrays
        this.positions = [];
        this.transitionPoints = [];

        // Initialize prediction starting point with spacecraft's current state using Vector2
        let predictPos = new MathUtilities.Vector2(spacecraft.x, spacecraft.y);
        let predictVel = new MathUtilities.Vector2(spacecraft.vx, spacecraft.vy);

        // Determine initial dominant gravitational influence
        let currentDominantBody = this.calculateDominantBody(predictPos.x, predictPos.y, planets);
        this.orbitalPeriod = this.calculateOrbitalPeriod(spacecraft, [currentDominantBody]);
        
        // Setup prediction parameters
        const stepsPerOrbit = this.predictionQuality;  // How many points to calculate per orbit
        const totalSteps = Math.floor(stepsPerOrbit * this.targetOrbits);  // Total prediction points
        const timeStep = timeWarp;  // Time increment per step
        let orbitCount = 0;  // Track completed orbits
        
        // Track orbital angle progression
        const bodyPos = new MathUtilities.Vector2(currentDominantBody.x, currentDominantBody.y);
        let lastAngle = predictPos.angleTo(bodyPos);
        let angleAccumulator = 0;  // Accumulate angle change to detect complete orbits

        // Main prediction loop
        for (let i = 0; i < totalSteps && orbitCount < this.targetOrbits; i++) {
            // Reset force accumulation for this step using Vector2
            let totalForce = MathUtilities.Vector2.zero;

            // Calculate gravitational forces from all planets
            for (const planet of planets) {
                let planetPos = new MathUtilities.Vector2(planet.x, planet.y);
                
                // If planet is orbiting, predict its future position
                if (planet.isOrbiting) {
                    const futureAngle = planet.orbitalAngle + planet.orbitalSpeed * timeStep * i;
                    planetPos = MathUtilities.Vector2.fromAngle(futureAngle, planet.orbitalRadius);
                    const centerPos = new MathUtilities.Vector2(planet.centerX, planet.centerY);
                    planetPos.addInPlace(centerPos);
                }

                // Calculate vector from spacecraft to planet
                const toPlanet = planetPos.subtract(predictPos);
                const distance = toPlanet.length();
                
                // Stop prediction if collision detected
                if (distance <= planet.radius) {
                    return;
                }
                
                // Calculate gravitational force using Newton's law
                const forceMagnitude = (planet.mass / (distance * distance)) * 0.01 * timeStep;
                
                // Add force in direction of planet (normalized)
                const forceDir = toPlanet.normalize();
                totalForce.addInPlace(forceDir.multiply(forceMagnitude));
            }

            // Update velocity based on gravitational forces
            predictVel.addInPlace(totalForce);
            
            // Update position based on velocity
            predictPos.addInPlace(predictVel.multiply(timeStep));

            // Check for changes in dominant gravitational influence
            const newDominantBody = this.calculateDominantBody(predictPos.x, predictPos.y, planets);
            
            // Record transition points between gravity wells
            if (newDominantBody !== currentDominantBody) {
                this.transitionPoints.push({
                    x: predictPos.x,
                    y: predictPos.y,
                    enteringBody: newDominantBody
                });
            }
            
            // Track orbital progress around current dominant body
            if (newDominantBody === currentDominantBody) {
                const bodyPos = new MathUtilities.Vector2(currentDominantBody.x, currentDominantBody.y);
                const newAngle = predictPos.angleTo(bodyPos);
                
                // Calculate angle change, normalized to [-π, π]
                const angleDiff = ((newAngle - lastAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
                angleAccumulator += angleDiff;
                
                // Check for completed orbit
                if (Math.abs(angleAccumulator) >= Math.PI * 2) {
                    orbitCount++;
                    angleAccumulator = 0;
                }
                lastAngle = newAngle;
            }

            // Handle transition to new dominant body
            if (newDominantBody !== currentDominantBody) {
                currentDominantBody = newDominantBody;
                
                // Recalculate orbital period for new dominant body
                this.orbitalPeriod = this.calculateOrbitalPeriod(
                    { x: predictPos.x, y: predictPos.y, vx: predictVel.x, vy: predictVel.y },
                    [currentDominantBody]
                );
                
                // Reset angle tracking for new orbit
                angleAccumulator = 0;
                const bodyPos = new MathUtilities.Vector2(currentDominantBody.x, currentDominantBody.y);
                lastAngle = predictPos.angleTo(bodyPos);
            }

            // Calculate fade-out effect for distant predictions
            const opacity = Math.max(0.2, 1 - (orbitCount / this.targetOrbits));

            // Store predicted position (store as x, y for compatibility with draw method)
            this.positions.push({
                x: predictPos.x,
                y: predictPos.y,
                opacity: opacity,
                dominantBody: currentDominantBody
            });
        }
    }

    // Draw the predicted orbital path and transition points
    draw(ctx, camera) {
        // Don't draw anything if we don't have at least 2 points for a line
        if (this.positions.length < 2) return;

        // Simple white orbit line when sphere of influence display is off
        if (GameState.showSphereOfInfluence) {
            // Start a new path for the orbital prediction
            ctx.beginPath();
            // Set line style to white with thin width
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;

            // Draw line segments between predicted positions
            for (let i = 1; i < this.positions.length; i++) {
                const pos = this.positions[i];        // Current position
                const prevPos = this.positions[i - 1];  // Previous position

                // Convert world coordinates to screen coordinates using camera transform
                const screenX = (pos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (pos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;
                const prevScreenX = (prevPos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const prevScreenY = (prevPos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // For first point, move to position without drawing
                if (i === 1) {
                    ctx.moveTo(prevScreenX, prevScreenY);
                }
                // Draw line to current point
                ctx.lineTo(screenX, screenY);
            }
            // Render the complete orbit line
            ctx.stroke();
        } 
        // Advanced display showing sphere of influence regions
        else {
            // Track current dominant body for color changes
            let currentDominantBody = null;
            ctx.lineWidth = 1;

            // Draw orbit segments colored by dominant gravitational influence
            for (let i = 1; i < this.positions.length; i++) {
                const pos = this.positions[i];
                const prevPos = this.positions[i - 1];

                // When dominant body changes, start new path segment with new color
                if (pos.dominantBody !== currentDominantBody) {
                    // Finish previous path if exists
                    if (currentDominantBody !== null) {
                        ctx.stroke();
                    }
                    // Update tracking and start new path
                    currentDominantBody = pos.dominantBody;
                    ctx.beginPath();
                    // Use body's color (slightly transparent) or white if no body
                    ctx.strokeStyle = currentDominantBody ? `${currentDominantBody.color}dd` : '#ffffffdd';
                }

                // Convert positions to screen coordinates
                const screenX = (pos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (pos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;
                const prevScreenX = (prevPos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const prevScreenY = (prevPos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // Start new line at first point or sphere of influence transition
                if (i === 1 || pos.dominantBody !== prevPos.dominantBody) {
                    ctx.moveTo(prevScreenX, prevScreenY);
                }
                // Draw line to current point
                ctx.lineTo(screenX, screenY);
            }
            // Complete final path segment
            ctx.stroke();

            // Draw transition points where spacecraft changes dominant gravitational influence
            for (const point of this.transitionPoints) {
                // Convert transition point to screen coordinates
                const screenX = (point.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (point.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // Draw circular marker at transition point
                ctx.beginPath();
                // Use entering body's color or white if no body
                ctx.fillStyle = point.enteringBody ? point.enteringBody.color : '#ffffff';
                // Draw 4px radius circle
                ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

window.OrbitPredictor = OrbitPredictor;
