// Contains the asset for the orbital guide arc

class ArcAsset {
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
        // First check the smaller orbiting planet (moon/satellite)
        // It takes priority within its sphere of influence despite lower mass
        const smallPlanet = planets.find(p => p.isOrbiting);
        if (smallPlanet) {
            // Calculate distance to the orbiting body
            const dx = smallPlanet.x - x;
            const dy = smallPlanet.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
                
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
            const dx = mainPlanet.x - x;
            const dy = mainPlanet.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
                
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
            const dx = planet.x - x;
            const dy = planet.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
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
        
        // Check gravitational force from each planet
        for (const planet of planets) {
            // Calculate distance vector components
            const dx = planet.x - spacecraft.x;
            const dy = planet.y - spacecraft.y; 
            // Get total distance using Pythagorean theorem
            const distance = Math.sqrt(dx * dx + dy * dy);
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
        const dx = dominantPlanet.x - spacecraft.x;
        const dy = dominantPlanet.y - spacecraft.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
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

        // Initialize prediction starting point with spacecraft's current state
        let predictX = spacecraft.x;
        let predictY = spacecraft.y;
        let predictVx = spacecraft.vx;
        let predictVy = spacecraft.vy;

        // Determine initial dominant gravitational influence
        let currentDominantBody = this.calculateDominantBody(predictX, predictY, planets);
        this.orbitalPeriod = this.calculateOrbitalPeriod(spacecraft, [currentDominantBody]);
        
        // Setup prediction parameters
        const stepsPerOrbit = this.predictionQuality;  // How many points to calculate per orbit
        const totalSteps = Math.floor(stepsPerOrbit * this.targetOrbits);  // Total prediction points
        const timeStep = timeWarp;  // Time increment per step
        let orbitCount = 0;  // Track completed orbits
        
        // Track orbital angle progression
        let lastAngle = Math.atan2(predictY - currentDominantBody.y, predictX - currentDominantBody.x);
        let angleAccumulator = 0;  // Accumulate angle change to detect complete orbits

        // Main prediction loop
        for (let i = 0; i < totalSteps && orbitCount < this.targetOrbits; i++) {
            // Reset force accumulation for this step
            let totalFx = 0;
            let totalFy = 0;

            // Calculate gravitational forces from all planets
            for (const planet of planets) {
                let planetX = planet.x;
                let planetY = planet.y;
                
                // If planet is orbiting, predict its future position
                if (planet.isOrbiting) {
                    const futureAngle = planet.orbitalAngle + planet.orbitalSpeed * timeStep * i;
                    planetX = planet.centerX + Math.cos(futureAngle) * planet.orbitalRadius;
                    planetY = planet.centerY + Math.sin(futureAngle) * planet.orbitalRadius;
                }

                // Calculate distance to planet
                const dx = planetX - predictX;
                const dy = planetY - predictY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Stop prediction if collision detected
                if (distance <= planet.radius) {
                    return;
                }
                
                // Calculate gravitational force using Newton's law
                const force = (planet.mass / (distance * distance)) * 0.01 * timeStep;
                const angle = Math.atan2(dy, dx);
                
                // Add force components to total
                totalFx += Math.cos(angle) * force;
                totalFy += Math.sin(angle) * force;
            }

            // Update velocity based on gravitational forces
            predictVx += totalFx;
            predictVy += totalFy;
            // Update position based on velocity
            predictX += predictVx * timeStep;
            predictY += predictVy * timeStep;

            // Check for changes in dominant gravitational influence
            const newDominantBody = this.calculateDominantBody(predictX, predictY, planets);
            
            // Record transition points between gravity wells
            if (newDominantBody !== currentDominantBody) {
                this.transitionPoints.push({
                    x: predictX,
                    y: predictY,
                    enteringBody: newDominantBody
                });
            }
            
            // Track orbital progress around current dominant body
            if (newDominantBody === currentDominantBody) {
                const newAngle = Math.atan2(predictY - currentDominantBody.y, predictX - currentDominantBody.x);
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
                    { x: predictX, y: predictY, vx: predictVx, vy: predictVy },
                    [currentDominantBody]
                );
                // Reset angle tracking for new orbit
                angleAccumulator = 0;
                lastAngle = Math.atan2(predictY - currentDominantBody.y, predictX - currentDominantBody.x);
            }

            // Calculate fade-out effect for distant predictions
            const opacity = Math.max(0.2, 1 - (orbitCount / this.targetOrbits));

            // Store predicted position
            this.positions.push({
                x: predictX,
                y: predictY,
                opacity: opacity,
                dominantBody: currentDominantBody
            });
        }
    }
}

window.ArcAsset = ArcAsset;
