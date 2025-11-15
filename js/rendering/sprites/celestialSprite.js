class CelestialSprite {
    constructor(asset) {
        this.asset = asset;  // Just store reference
    }

    drawBody(ctx, camera) {
        ctx.fillStyle = this.asset.innerColor + '75';
        ctx.beginPath();
        ctx.arc(this.asset.position.x, this.asset.position.y, this.asset.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.asset.outerColor;
        ctx.beginPath();
        ctx.arc(this.asset.position.x, this.asset.position.y, this.asset.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSOI(ctx, camera) {
        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.asset.outerColor + '75';

        // Scale dashes with zoom - smaller dashes when zoomed out, larger when zoomed in
        const dashSize = 10 / camera.zoom;
        ctx.setLineDash([dashSize, dashSize]);

        ctx.beginPath();
        ctx.arc(this.asset.position.x, this.asset.position.y, this.asset.sphereOfInfluence, Math.PI / 2, -Math.PI * 3 / 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
    }
}

window.CelestialSprite = CelestialSprite;
