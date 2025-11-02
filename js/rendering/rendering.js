class Rendering {
    static init() {
        this.ctx = EngineStart.ctx;
        this.canvas = EngineStart.canvas;
        this.camera = new Camera();
        
        // Single listener for rendering - triggered by gameTick
        window.engineEvent.on('gameTick', () => {
            this.render();
        });
    }

    static clearScreen() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset transform first
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static applyTransform() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Reset and apply camera transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.ctx.translate(-this.camera.x, -this.camera.y);
    }
    
    // Renders the starfield background
    static renderBackground() {
        this.ctx.save();
        RenderStarfield.drawStarfield(this.ctx, this.camera);
        this.ctx.restore();
    }

    static renderCelestials() {
        if (!window.celestialSprites || window.celestialSprites.length === 0) return;

        this.ctx.save();
        // Apply camera transform so celestial sprites are drawn in world space
        this.applyTransform();

        // Ensure assets sync to sprites (use zero dt if caller doesn't supply one)
        if (typeof window.updateCelestials === 'function') window.updateCelestials(0);

        for (const sprite of window.celestialSprites) {
            if (typeof sprite.draw === 'function') {
                sprite.draw(this.ctx, this.camera);
            }
        }

        this.ctx.restore();
    }

    static render() {
        // Clear screen, apply camera transform
        this.clearScreen();  // Clear entire canvas
        this.renderBackground();

        // Apply camera transform after background rendering
        this.applyTransform(); 
        this.renderCelestials();
    }
}

window.Rendering = Rendering;
