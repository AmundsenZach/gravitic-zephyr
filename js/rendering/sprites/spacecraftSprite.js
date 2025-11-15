class SpacecraftSprite {
    constructor(asset) {
        this.asset = asset;
    }

    draw(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const worldPos = this.spriteVector || new MathUtilities.Vector2(this.asset.x, this.asset.y);
        const worldDelta = MathUtilities.Vector2.subtract(worldPos, camera.vector);
        const scaled = MathUtilities.Vector2.multiply(worldDelta, camera.zoom);
        const screenPos = MathUtilities.Vector2.add(scaled, MathUtilities.Vector2.duplicate(ctx.canvas.width / 2));

        ctx.translate(screenPos.x, screenPos.y);
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
