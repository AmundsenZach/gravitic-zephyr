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
            const canvasVector = new MathUtilities.Vector2(ctx.canvas.width, ctx.canvas.height);
            const x = ((angleVector.x - camera.cameraVector.x * 0.1) % canvasVector.x + canvasVector.x) % canvasVector.x;
            const y = ((angleVector.y - camera.cameraVector.y * 0.1) % canvasVector.y + canvasVector.y) % canvasVector.y;

            // 0.5% chance for a larger 3px star, otherwise 1px
            const size = Math.random() < 0.005 ? 3 : 1;
        
            // Draw the star as a rectangle
            ctx.fillRect(x, y, size, size);
        }
    }
}

window.Background = Background;
