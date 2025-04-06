// Central rendering system, to be called by the game loop

class Rendering {
    static init() {
        this.ctx = GameStart.ctx;
        this.canvas = GameStart.canvas;
        this.camera = new Camera();
    }

    // Clears the screen to black
    static clearScreen() {
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
  
    // Renders the starfield background
    static renderBackground() {
        this.ctx.save();
        RenderStarfield.drawStarfield(this.ctx, this.camera);
        this.ctx.restore();
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
