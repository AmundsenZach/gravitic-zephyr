class MouseInput {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        
        // Setup zoom event listener
        this.setupZoomListener();
    }
    
    setupZoomListener() {
        // Mouse wheel controls camera zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            // Calculate new zoom target based on wheel direction
            this.camera.targetZoom *= e.deltaY > 0 ? 0.9 : 1.1;
            // Clamp zoom between 0.1 and 5
            this.camera.targetZoom = Math.max(0.1, Math.min(this.camera.targetZoom, 5));
        });
    }
}

window.MouseInput = MouseInput;
