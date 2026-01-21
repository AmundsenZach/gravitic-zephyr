import { GameConfig } from '../../game/core/gameConfig.js';

class PhysicsUtilities {
    // --- CONSTANTS ---

    // Gravitational Constant (Real-world value).
    // In a game, you usually set this to 1 or a custom scaling factor.
    static G = GameConfig.GRAVITATIONAL_CONSTANT;

    // --- NEWTONIAN GRAVITY ---

    // Calculates the force of gravity between two masses at a specific distance
    // F = G * (m1 * m2) / r^2
    static gravitationalForce(mass1, mass2, distance) {
        if (distance === 0) return 0; // Prevent division by zero
        return (PhysicsUtilities.G * mass1 * mass2) / (distance * distance);
    }

    // Calculates the Standard Gravitational Parameter (mu)
    // mu = G * M (where M is the mass of the central body)
    static standardGravitationalParameter(centralMass) {
        return PhysicsUtilities.G * centralMass;
    }

    // --- ORBITAL MECHANICS (KEPLER) ---

    // 1. Calculate Mean Motion (n)
    // The average angular speed (radians per time unit)
    // n = 2 * PI / Period
    static meanMotion(orbitalPeriod) {
        return (2 * Math.PI) / orbitalPeriod;
    }

    // 2. Calculate Current Mean Anomaly (M)
    // M = M0 + n * (t - t0)
    static meanAnomaly(meanAnomalyAtEpoch, meanMotion, timeSinceEpoch) {
        let M = meanAnomalyAtEpoch + meanMotion * timeSinceEpoch;
        // Normalize M to 0..2PI range
        return M % (2 * Math.PI);
    }

    // 3. Solve Kepler's Equation for Eccentric Anomaly (E)
    // M = E - e * sin(E)
    // Solved using Newton-Raphson iteration
    static solveKepler(meanAnomaly, eccentricity, tolerance = 1e-6) {
        // If orbit is circular, E = M
        if (eccentricity === 0) return meanAnomaly;

        // Initial guess: E0 = M (works well for small eccentricity)
        // For high eccentricity (e > 0.8), E0 = PI is safer, but M is usually fine for games.
        let E = meanAnomaly;

        // Perform iterations
        for (let i = 0; i < 10; i++) { // Max 10 iterations is usually plenty
            const f = E - eccentricity * Math.sin(E) - meanAnomaly;
            const df = 1 - eccentricity * Math.cos(E);

            const delta = f / df;
            E = E - delta;

            // Check for convergence
            if (Math.abs(delta) < tolerance) {
                break;
            }
        }

        return E;
    }

    // 4. Calculate True Anomaly (nu) from Eccentric Anomaly (E)
    // tan(nu/2) = sqrt((1+e)/(1-e)) * tan(E/2)
    static trueAnomaly(eccentricAnomaly, eccentricity) {
        const factor = Math.sqrt((1 + eccentricity) / (1 - eccentricity));
        const tanE2 = Math.tan(eccentricAnomaly / 2);
        const tanNu2 = factor * tanE2;

        // Use atan2 to handle quadrant ambiguity correctly, but standard atan * 2 works here
        // because we are mapping the half-angles.
        return 2 * Math.atan(tanNu2);
    }

    // 5. Calculate Radius (r)
    // r = a * (1 - e^2) / (1 + e * cos(nu))
    static orbitalRadius(semiMajorAxis, eccentricity, trueAnomaly) {
        const numerator = semiMajorAxis * (1 - eccentricity * eccentricity);
        const denominator = 1 + eccentricity * Math.cos(trueAnomaly);
        return numerator / denominator;
    }

    // 6. Vis-Viva Equation (Instantaneous Orbital Speed)
    // v = sqrt( mu * (2/r - 1/a) )
    static orbitalSpeed(mu, radius, semiMajorAxis) {
        return Math.sqrt(mu * (2 / radius - 1 / semiMajorAxis));
    }
}

export { PhysicsUtilities };
