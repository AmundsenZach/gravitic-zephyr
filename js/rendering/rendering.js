// Updated Rendering System with Input Integration
class Rendering {
    static init() {
        this.ctx = EngineStart.ctx;
        this.canvas = EngineStart.canvas;
        this.camera = new Camera();
        
        // Initialize input systems
        this.keyboardInput = new KeyboardInput();
        this.mobileControls = new TouchInput(this.canvas, this.camera);
        
    // Initialize debug module
    this.debug = new RenderDebug(this);
        
        // Setup mouse wheel zoom control
        this.setupMouseControls();
    }
    
    // Setup mouse controls
    static setupMouseControls() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.handleMouseWheel(e.deltaY);
        });
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

    // Renders all celestial sprites (planets/moons)
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
    
    // Renders debug elements via RenderDebug instance
    static renderDebug() {
        if (!this.debug) return;
        this.debug.render();
    }
    
    // Apply camera transform to context
    static applyTransform() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Reset previous transforms
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Move to canvas center
        this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
        
        // Apply zoom
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Move to camera position
        this.ctx.translate(-this.camera.x, -this.camera.y);
    }
    
    // Handle input and update camera
    static updateSystems() {
        // Handle debug toggle
        if (this.keyboardInput.isActionJustPressed('toggleDebug') && this.debug) {
            this.debug.toggle();
        }
        
        // Update camera with input
        this.camera.update(this.keyboardInput);
    }
    
    // Main render function that calls the sub-functions
    static render() {
        // Update input and camera systems
        this.updateSystems();
        
        // Clear the screen first
        this.clearScreen();
        
        // Then render the background
        this.renderBackground();
        
        // Render celestial bodies
        this.renderCelestials();
        
        // Render debug elements
        this.renderDebug();
    }
    
    // Toggle debug mode on/off
    static toggleDebug() {
        if (this.debug) !this.debug.toggle();
    }
    
    // Utility function to get world position from mouse/touch position
    static screenToWorld(screenX, screenY) {
        return this.camera.screenToWorld(screenX, screenY, this.canvas);
    }
    
    // Utility function to get screen position from world position
    static worldToScreen(worldX, worldY) {
        return this.camera.worldToScreen(worldX, worldY, this.canvas);
    }
}

window.Rendering = Rendering;
