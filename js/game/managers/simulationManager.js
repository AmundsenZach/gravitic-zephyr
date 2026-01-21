import { CelestialAsset } from '../assets/celestialAsset.js';
import { VectorUtilities } from '../../engine/utilities/vectorUtilities.js';
import { PhysicsUtilities } from '../../engine/utilities/physicsUtilities.js';

class SimulationManager {
    constructor() {
        this.celestialBodies = [];
        this.time = 0; // Simulation time in seconds
    }

    // Initialize with celestial bodies from AssetManager
    init(assets) {
        this.celestialBodies = assets.filter(asset => asset instanceof CelestialAsset);

        // Initialize positions for stationary bodies
        this.celestialBodies.forEach(body => {
            if (!body.parentId && !body.position) {
                body.position = new VectorUtilities(0, 0);
            }
        });

        // Sort by hierarchy depth (stars first, then planets, then moons)
        this.sortByHierarchy();
    }

    // Main physics update
    update(dt) {
        this.time += dt;
        
        // Update each body's position
        this.celestialBodies.forEach(body => {
            this.updateOrbitalPosition(body);
        });
    }

    updateOrbitalPosition(body) {
        // Skip stationary bodies (stars)
        if (!body.parentId) return;

        const parent = body.parentId;
        const mu = PhysicsUtilities.standardGravitationalParameter(parent.mass);

        // Calculate orbital period
        const period = 2 * Math.PI * Math.sqrt(
            Math.pow(body.semiMajorAxis, 3) / mu
        );
        
        // Get mean motion
        const n = PhysicsUtilities.meanMotion(period);

        // Calculate current mean anomaly
        const M = PhysicsUtilities.meanAnomaly(body.meanAnomaly, n, this.time);

        // Solve Kepler's equation for eccentric anomaly
        const E = PhysicsUtilities.solveKepler(M, body.eccentricity);

        // Get true anomaly
        const nu = PhysicsUtilities.trueAnomaly(E, body.eccentricity);

        // Calculate orbital radius
        const r = PhysicsUtilities.orbitalRadius(
            body.semiMajorAxis, 
            body.eccentricity, 
            nu
        );
        
        // Convert to Cartesian coordinates (relative to parent)
        const theta = nu + body.argumentOfPeriapsis;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        
        // Set position (parent position + orbital offset)
        body.position = new VectorUtilities(
            parent.position.x + x,
            parent.position.y + y
        );
    }

    // Reset simulation to t=0
    reset() {
        this.time = 0;
        this.celestialBodies.forEach(body => {
            this.updateOrbitalPosition(body);
        });
    }

    // Utility: Get all bodies
    getBodies() {
        return this.celestialBodies;
    }

    // Sort bodies so parents are always updated before children
    sortByHierarchy() {
        this.celestialBodies.sort((a, b) => {
            return this.getDepth(a) - this.getDepth(b);
        });
    }

    // Get hierarchy depth (0 = star, 1 = planet, 2 = moon, etc.)
    getDepth(body) {
        let depth = 0;
        let current = body;

        while (current.parentId) {
            depth++;
            current = current.parentId;
        }

        return depth;
    }
}

export { SimulationManager };
