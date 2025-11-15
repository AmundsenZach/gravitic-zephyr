class Background {
    // Draws a parallax scrolling starfield background
    static drawStarfield(ctx, camera) {
        const density = 1000; // Set number of stars to render
    
        // Set star color to white
        ctx.fillStyle = 'white';

        // Generate each star
        for (let loop = 0; loop < density; loop++) {
            // Calculate star position with parallax effect
            const angleVector = MathUtilities.Vector2.fromAngle(loop, 10000);
            const x = ((angleVector.x - camera.vector.x * 0.1) % ctx.canvas.width + ctx.canvas.width) % ctx.canvas.width;
            const y = ((angleVector.y - camera.vector.y * 0.1) % ctx.canvas.height + ctx.canvas.height) % ctx.canvas.height;

            // 0.5% chance for a larger 3px star, otherwise 1px
            const size = Math.random() < 0.005 ? 3 : 1;
        
            // Draw the star as a rectangle
            ctx.fillRect(x, y, size, size);
        }
    }
}

window.Background = Background;
