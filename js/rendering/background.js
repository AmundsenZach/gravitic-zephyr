class Background {
    // Draws a parallax scrolling starfield background
    static drawStarfield(ctx, camera) {
        const backgroundDensity = EngineConfig.BACKGROUND_DENSITY; // Set number of stars to render
        ctx.fillStyle = 'white'; // Star color

        // Generate each star
        for (let loop = 0; loop < backgroundDensity; loop++) {
            // Calculate star position with parallax effect
            const vector = MathUtilities.Vector2.fromAngle(loop, 10000);
            const position = new MathUtilities.Vector2(ctx.canvas.width, ctx.canvas.height);
            const x = ((vector.x - camera.vector.x * 0.2) % position.x * 50) % position.x;
            const y = ((vector.y - camera.vector.y * 0.2) % position.y * 50) % position.y;

            // 0.5% chance for a larger 3px star, otherwise 1px
            const size = Math.random() < 0.005 ? 3 : 1;
        
            // Draw the star as a rectangle
            ctx.fillRect(x, y, size, size);
        }
    }
}

window.Background = Background;
