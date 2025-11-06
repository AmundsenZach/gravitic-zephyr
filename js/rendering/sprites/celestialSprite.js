class CelestialSprite {
    constructor(config) {
        this.id = config.id;
    }

    drawBody(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

        // Create glowing effect using radial gradient
        const gradient = ctx.createRadialGradient(
            screenX, screenY, this.radius * camera.zoom * 0.5,
            screenX, screenY, this.radius * camera.zoom
        );

        gradient.addColorStop(0, this.color + '75'); // Semi-transparent inner
        gradient.addColorStop(1, this.color + '50'); // Transparent outer

        // Draw the glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();

        // Draw the planet's outline
        ctx.lineWidth = camera.zoom;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSOI(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

        if (!this.sphereOfInfluence) return;

        // Draw sphere of influence as dashed circle
        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.color + '75'; // Semi-transparent
        ctx.setLineDash([10, 10]); // Dashed line pattern
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.sphereOfInfluence * camera.zoom, Math.PI / 2, -Math.PI * 3 / 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
    }

    // Backwards-compatible single-call draw (optional: draws body only)
    draw(ctx, camera) {
        this.drawBody(ctx, camera);
    }
}

window.CelestialSprite = CelestialSprite;
