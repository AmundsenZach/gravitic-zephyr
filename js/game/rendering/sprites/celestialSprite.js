class CelestialSprite {
    constructor(config) {
        this.id = config.id;
        this.asset = null; // Will be set by SpriteManager

        // Visual properties (synced from asset)
        this.position = null;
        this.innerColor = null;
        this.outerColor = null;
        this.radius = null;
        this.sphereOfInfluence = null;
    }

    drawBody(ctx, camera) {
        // Guard: don't draw if position isn't set yet
        if (!this.position) return;

        ctx.fillStyle = this.innerColor + '75';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.outerColor;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSOI(ctx, camera) {
        if (!this.position) return;

        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeStyle = this.outerColor + '75';

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.sphereOfInfluence, Math.PI / 2, -Math.PI * 3 / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

window.CelestialSprite = CelestialSprite;
