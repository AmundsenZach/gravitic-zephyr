class CelestialSprite {
    constructor(config) {
        this.id = config.id;
    }

    drawBody(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.x - camera.cameraVector.x) * camera.zoom + ctx.canvas.width / 2; // Use Vector2 in future
        const screenY = (this.y - camera.cameraVector.y) * camera.zoom + ctx.canvas.height / 2;

        // Create glowing effect using radial gradient
        const gradient = ctx.createRadialGradient(
            screenX, screenY, this.radius * camera.zoom * 0.5,
            screenX, screenY, this.radius * camera.zoom
        );

        gradient.addColorStop(0, this.innerColor + '75'); // Semi-transparent inner
        gradient.addColorStop(1, this.innerColor + '50'); // Transparent outer

        // Draw the glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();

        // Draw the planet's outline
        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.outerColor;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSOI(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.x - camera.cameraVector.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.y - camera.cameraVector.y) * camera.zoom + ctx.canvas.height / 2;

        // Draw sphere of influence as dashed circle
        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.outerColor + '75'; // Semi-transparent
        ctx.setLineDash([10, 10]); // Dashed line pattern
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.sphereOfInfluence * camera.zoom, Math.PI / 2, -Math.PI * 3 / 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
    }
}

window.CelestialSprite = CelestialSprite;
