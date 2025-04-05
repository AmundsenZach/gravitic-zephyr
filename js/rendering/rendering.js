// Central rendering system, to be called by the game loop

class Rendering {
    // Clears the screen to black
    static clearScreen() {
        const ctx = GameStart.ctx;
        const canvas = GameStart.canvas;
        
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
  
    // Renders the starfield background
    static renderBackground() {
        const ctx = GameStart.ctx;
        ctx.save();
        RenderStarfield.drawStarfield(ctx, this.camera);
        ctx.restore();
    }
  
    // Main render function that calls the sub-functions
    static render() {
        // Clear the screen first
        this.clearScreen();

        // Then render the background
        this.renderBackground();

        // Additional rendering steps can be added here
    }
}

window.Rendering = Rendering;
