class SpacecraftSprite {
    constructor(asset) {
        this.asset = asset;
    }

    draw(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenVector = this.spriteVector //|| new MathUtilities.Vector2(this.asset.x, this.asset.y);
        const screenPosition = MathUtilities.Vector2.screenPosition(screenVector);

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
