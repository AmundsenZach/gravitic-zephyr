class SpacecraftSprite {
    constructor(asset) {
        this.asset = asset;
    }

    draw(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const position = this.asset.position
        const screenPosition = MathUtilities.Vector2.screenPosition(position);

        ctx.translate(screenPosition.x, screenPosition.y);
        ctx.rotate(this.asset.rotation);

        // Draw triangular spacecraft shape
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10 * camera.zoom, 0);
        ctx.lineTo(-5 * camera.zoom, 5 * camera.zoom);
        ctx.lineTo(-5 * camera.zoom, -5 * camera.zoom);
        ctx.closePath();
        ctx.stroke();
    }
}

window.SpacecraftSprite = SpacecraftSprite;
