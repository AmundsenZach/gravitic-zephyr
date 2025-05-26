// V2 - Enhanced Camera with Input Integration
class Camera {
    constructor() {
        // Position of camera
        this.x = 0;
        this.y = 0;
        
        // Zoom level and adjustments
        this.zoom = 1;
        this.targetZoom = 1;
        this.zoomSpeed = 0.05;
        
        // Camera movement for manual control
        this.moveSpeed = 5; // Base movement speed
        this.target = null; // Optional target to follow
        this.isFollowing = false;
    }

    update(inputManager) {
        // Handle keyboard camera controls if not following a target
        if (!this.isFollowing && inputManager) {
            const moveSpeed = this.moveSpeed / this.zoom; // Adjust speed based on zoom
            
            // Camera movement
            if (inputManager.isActionActive('cameraMoveUp')) {
                this.y -= moveSpeed;
            }
            if (inputManager.isActionActive('cameraMoveDown')) {
                this.y += moveSpeed;
            }
            if (inputManager.isActionActive('cameraMoveLeft')) {
                this.x -= moveSpeed;
            }
            if (inputManager.isActionActive('cameraMoveRight')) {
                this.x += moveSpeed;
            }
            
            // Zoom controls
            if (inputManager.isActionActive('zoomIn')) {
                this.targetZoom *= 1.02; // Smooth continuous zoom
            }
            if (inputManager.isActionActive('zoomOut')) {
                this.targetZoom *= 0.98;
            }
            
            // Reset camera position
            if (inputManager.isActionJustPressed('cameraReset')) {
                this.x = 0;
                this.y = 0;
                this.targetZoom = 1;
            }
            
            // Toggle follow mode (when you eventually have a target)
            if (inputManager.isActionJustPressed('toggleFollow')) {
                this.isFollowing = !this.isFollowing;
            }
        }
        
        // Smoothly interpolate zoom
        this.zoom += (this.targetZoom - this.zoom) * this.zoomSpeed;
        
        // Clamp zoom levels
        this.targetZoom = Math.max(0.1, Math.min(this.targetZoom, 5));
        
        // Update input manager for next frame
        if (inputManager) {
            inputManager.update();
        }
    }
    
    // Set a target to follow (for later when you have spacecraft)
    setTarget(target) {
        this.target = target;
    }
    
    // Enable/disable following
    setFollowing(following) {
        this.isFollowing = following;
    }
    
    // Moves camera to target position (when following)
    follow(target) {
        if (target && this.isFollowing) {
            this.x = target.x;
            this.y = target.y;
        }
    }
    
    // Handle mouse wheel zoom (called from rendering system)
    handleMouseWheel(deltaY) {
        this.targetZoom *= deltaY > 0 ? 0.9 : 1.1;
        this.targetZoom = Math.max(0.1, Math.min(this.targetZoom, 5));
    }
    
    // Get screen position from world position
    worldToScreen(worldX, worldY, canvas) {
        const screenX = (worldX - this.x) * this.zoom + canvas.width / 2;
        const screenY = (worldY - this.y) * this.zoom + canvas.height / 2;
        return { x: screenX, y: screenY };
    }
    
    // Get world position from screen position
    screenToWorld(screenX, screenY, canvas) {
        const worldX = (screenX - canvas.width / 2) / this.zoom + this.x;
        const worldY = (screenY - canvas.height / 2) / this.zoom + this.y;
        return { x: worldX, y: worldY };
    }
}

window.Camera = Camera;
