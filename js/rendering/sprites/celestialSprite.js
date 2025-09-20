// Sprite creating the planets

// Class representing a planet or moon in the game
class CelestialBody {
    constructor(config) {
        this.id = config.id;
    }

    draw(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

        // Create glowing effect using radial gradient
        const gradient = ctx.createRadialGradient(
            screenX, screenY, this.radius * camera.zoom * 0.5,
            screenX, screenY, this.radius * camera.zoom
        );
        
        gradient.addColorStop(0, this.color + '33'); // Semi-transparent inner
        gradient.addColorStop(1, this.color + '00'); // Transparent outer

        // Draw the glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();

        // Draw the planet's outline
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([5, 15]); // Dashed line pattern
        ctx.strokeStyle = this.color + '44'; // Semi-transparent
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.sphereOfInfluence * camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
    }
}

window.CelestialBody = CelestialBody;
