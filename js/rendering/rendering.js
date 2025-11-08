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
        this.ctx.translate(-this.camera.cameraVector.x, -this.camera.cameraVector.y);
    }

    // Renders the starfield background
    static renderBackground() {
        Background.drawStarfield(this.ctx, this.camera);
    }

    // Render all celestial bodies
    static renderCelestialBodies() {
        if (!window.celestialSprites || window.celestialSprites.length === 0) {
            return;
        }

        for (const sprite of window.celestialSprites) {
            if (typeof sprite.drawBody === 'function') {
                sprite.drawBody(this.ctx, this.camera);
            }
        }
    }

    // Render all celestial spheres of influence
    static renderCelestialSOIs() {
        if (!window.celestialSprites || window.celestialSprites.length === 0) {
            return;
        }

        for (const sprite of window.celestialSprites) {
            if (typeof sprite.drawSOI === 'function') {
                sprite.drawSOI(this.ctx, this.camera);
            }
        }
    }

    // Render all spacecraft
    static renderSpacecraft() {
        if (!window.spacecraftSprites || window.spacecraftSprites.length === 0) {
            return;
        }

        for (const sprite of window.spacecraftSprites) {
            if (typeof sprite.draw === 'function') {
                sprite.draw(this.ctx, this.camera);
            }
        }
    }

    static render() {
        // Clear screen, apply camera transform
        this.clearScreen();
        this.renderBackground();
        this.applyTransform();

        // Render celestial objects in two layers: bodies first, then SOI
        this.renderCelestialBodies();
        this.renderCelestialSOIs();
    }
}

window.Rendering = Rendering;
