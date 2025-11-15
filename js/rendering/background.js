class Background {
    // Draws a parallax scrolling starfield background
    static drawStarfield(ctx, camera) {
        ctx.save();

        const position = new MathUtilities.Vector2(ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';

        for (let loop = 0; loop < EngineConfig.BACKGROUND_DENSITY; loop++) {
            // Parallax factor - adjust as needed
            const vector = MathUtilities.Vector2.fromAngle(loop, 10000);
            const parallax = 0.1;

            const x = ((vector.x - camera.vector.x * parallax) % position.x + position.x) % position.x;
            const y = ((vector.y - camera.vector.y * parallax) % position.y + position.y) % position.y;

            const size = Math.random() < 0.005 ? 3 : 1;
            ctx.fillRect(x, y, size, size);
        }

        ctx.restore();
    }
}

window.Background = Background;
