class TouchInput {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        
        // Touch state tracking
        this.touches = new Map();
        this.lastPanPosition = null;
        this.lastPinchDistance = null;
        
        // Configuration
        this.panSensitivity = 1.0;
        this.zoomSensitivity = 0.01;
        this.minZoom = 0.1;
        this.maxZoom = 5.0;
        
        // Only initialize on mobile devices
        this.isMobile = !window.matchMedia('(pointer: fine) and (hover: hover)').matches;
        
        if (this.isMobile) {
            this.setupTouchListeners();
        }
    }
    
    setupTouchListeners() {
        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        
        // Store all current touches
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                startX: touch.clientX,
                startY: touch.clientY
            });
        }
        
        // Initialize pan position for single touch
        if (e.touches.length === 1) {
            this.lastPanPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        
        // Initialize pinch distance for two touches
        if (e.touches.length === 2) {
            this.lastPinchDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single touch - pan camera
            const touch = e.touches[0];
            
            if (this.lastPanPosition) {
                const deltaX = touch.clientX - this.lastPanPosition.x;
                const deltaY = touch.clientY - this.lastPanPosition.y;
                
                // Move camera in opposite direction of touch movement
                // Adjust movement by zoom level so it feels consistent
                this.camera.x -= (deltaX / this.camera.zoom) * this.panSensitivity;
                this.camera.y -= (deltaY / this.camera.zoom) * this.panSensitivity;
                
                // Turn off following mode when manually panning
                this.camera.setFollowing(false);
            }
            
            this.lastPanPosition = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
        else if (e.touches.length === 2) {
            // Two touches - pinch to zoom
            const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
            
            if (this.lastPinchDistance) {
                const deltaDistance = currentDistance - this.lastPinchDistance;
                const zoomFactor = 1 + (deltaDistance * this.zoomSensitivity);
                
                this.camera.targetZoom *= zoomFactor;
                this.camera.targetZoom = Math.max(this.minZoom, Math.min(this.camera.targetZoom, this.maxZoom));
            }
            
            this.lastPinchDistance = currentDistance;
        }
    }
    
    handleTouchEnd(e) {
        // Remove ended touches from tracking
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.touches.delete(touch.identifier);
        }
        
        // Reset pan position if no touches remain
        if (e.touches.length === 0) {
            this.lastPanPosition = null;
            this.lastPinchDistance = null;
        }
        // Reset pinch distance if only one touch remains
        else if (e.touches.length === 1) {
            this.lastPinchDistance = null;
            this.lastPanPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    }
    
    // Calculate distance between two touches
    getTouchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Get the center point between two touches (useful for zoom center)
    getTouchCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
    
    // Check if currently touching
    isTouching() {
        return this.touches.size > 0;
    }
    
    // Get number of active touches
    getTouchCount() {
        return this.touches.size;
    }
}

window.TouchInput = TouchInput;
