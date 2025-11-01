class ArcSprite {
    // Initialize predictor with default settings for accuracy and visualization
    constructor() {
        // Array to store predicted future positions of spacecraft
        this.positions = [];
            
        // Current calculated orbital period in game units
        this.orbitalPeriod = 0;
            
        // Number of points to calculate per orbit
        // Higher values give smoother predictions but cost more performance
        this.predictionQuality = 2000;
            
        // Number of complete orbits to predict ahead
        // More orbits show longer-term behavior but require more calculation
        this.targetOrbits = 5;
            
        // Array to store points where spacecraft transitions between gravity wells
        // Used for visualizing sphere of influence changes
        this.transitionPoints = [];
    }

    // Draw the predicted orbital path and transition points
    draw(ctx, camera) {
        // Don't draw anything if we don't have at least 2 points for a line
        if (this.positions.length < 2) return;

        // Simple white orbit line when sphere of influence display is off
        if (GameState.showSphereOfInfluence) {
            // Start a new path for the orbital prediction
            ctx.beginPath();
            // Set line style to white with thin width
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;

            // Draw line segments between predicted positions
            for (let i = 1; i < this.positions.length; i++) {
                const pos = this.positions[i];        // Current position
                const prevPos = this.positions[i - 1];  // Previous position

                // Convert world coordinates to screen coordinates using camera transform
                const screenX = (pos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (pos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;
                const prevScreenX = (prevPos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const prevScreenY = (prevPos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // For first point, move to position without drawing
                if (i === 1) {
                    ctx.moveTo(prevScreenX, prevScreenY);
                }
                // Draw line to current point
                ctx.lineTo(screenX, screenY);
            }
            // Render the complete orbit line
            ctx.stroke();
        } 
        // Advanced display showing sphere of influence regions
        else {
            // Track current dominant body for color changes
            let currentDominantBody = null;
            ctx.lineWidth = 1;

            // Draw orbit segments colored by dominant gravitational influence
            for (let i = 1; i < this.positions.length; i++) {
                const pos = this.positions[i];
                const prevPos = this.positions[i - 1];

                // When dominant body changes, start new path segment with new color
                if (pos.dominantBody !== currentDominantBody) {
                    // Finish previous path if exists
                    if (currentDominantBody !== null) {
                        ctx.stroke();
                    }
                    // Update tracking and start new path
                    currentDominantBody = pos.dominantBody;
                    ctx.beginPath();
                    // Use body's color (slightly transparent) or white if no body
                    ctx.strokeStyle = currentDominantBody ? `${currentDominantBody.color}dd` : '#ffffffdd';
                }

                // Convert positions to screen coordinates
                const screenX = (pos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (pos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;
                const prevScreenX = (prevPos.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const prevScreenY = (prevPos.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // Start new line at first point or sphere of influence transition
                if (i === 1 || pos.dominantBody !== prevPos.dominantBody) {
                    ctx.moveTo(prevScreenX, prevScreenY);
                }
                // Draw line to current point
                ctx.lineTo(screenX, screenY);
            }
            // Complete final path segment
            ctx.stroke();

            // Draw transition points where spacecraft changes dominant gravitational influence
            for (const point of this.transitionPoints) {
                // Convert transition point to screen coordinates
                const screenX = (point.x - camera.x) * camera.zoom + ctx.canvas.width / 2;
                const screenY = (point.y - camera.y) * camera.zoom + ctx.canvas.height / 2;

                // Draw circular marker at transition point
                ctx.beginPath();
                // Use entering body's color or white if no body
                ctx.fillStyle = point.enteringBody ? point.enteringBody.color : '#ffffff';
                // Draw 4px radius circle
                ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

window.ArcSprite = ArcSprite;
