// V2 - Updated Rendering System with Input Integration
class Rendering {
    static init() {
        this.ctx = GameStart.ctx;
        this.canvas = GameStart.canvas;
        this.camera = new Camera();
        
        // Initialize input systems
        this.keyboardInput = new KeyboardInput();
        this.mobileControls = new TouchInput(this.canvas, this.camera);
        
        // Initialize debug mode
        this.debugMode = true;
        
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
    
    // Renders debug elements when debug mode is active
    static renderDebug() {
        if (!this.debugMode) return;
        
        this.ctx.save();
        
        // Apply camera transform
        this.applyTransform();
        this.ctx.restore();
        
        // Show active controls (helpful for debugging input)
        this.renderControlsDebug();
    }
    
    // Show active input actions for debugging
    static renderControlsDebug() {
        const activeActions = this.keyboardInput.getActiveActions();
        if (activeActions.length === 0) return;
        
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to screen coordinates
        
        const x = this.canvas.width - 200;
        const y = 120;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - 10, y - 10, 190, activeActions.length * 20 + 20);
        
        // Title
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Active Controls:', x, y);
        
        // Active actions
        activeActions.forEach((action, index) => {
            this.ctx.fillText(`• ${action}`, x, y + 20 + (index * 20));
        });
        
        this.ctx.restore();
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
        if (this.keyboardInput.isActionJustPressed('toggleDebug')) {
            this.debugMode = !this.debugMode;
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
        
        // Render debug elements
        this.renderDebug();
    }
    
    // Toggle debug mode on/off
    static toggleDebug() {
        this.debugMode = !this.debugMode;
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
