class SpacecraftSprite {
    constructor(asset) {
        this.asset = asset;
    }

    draw(ctx, camera) {
        // Convert world coordinates to screen coordinates
        const screenX = (this.asset.x - camera.cameraVector.x) * camera.zoom + ctx.canvas.width / 2;
        const screenY = (this.asset.y - camera.cameraVector.y) * camera.zoom + ctx.canvas.height / 2;

        ctx.translate(screenX, screenY);
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
