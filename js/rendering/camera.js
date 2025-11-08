class Camera {
    constructor() {
        this.initProperties();
        this.setupEventListeners();
    }

    initProperties() { // Move to separate configuration method?
        this.cameraVector = new MathUtilities.Vector2(0, 0);

        this.zoom = 1;
        this.minZoom = 0.1;
        this.maxZoom = 5;

        this.keyboardZoomIn = 1.02;
        this.keyboardZoomOut = 0.98;

        this.mouseZoomIn = 1.1;
        this.mouseZoomOut = 0.9;

        this.targetZoom = 1;
        this.zoomSpeed = 0.025;
        
        this.moveSpeed = 5;
        this.isFollowing = false;
        this.target = null;
    }

    get adjustedMoveSpeed() {
        return this.moveSpeed / this.zoom;
    }
    
    setupEventListeners() {
        // Main update loop - runs every frame
        window.engineEvent.on('gameTick', () => {
            // If following a target, update camera position
            if (this.isFollowing && this.target) {
                this.follow(this.target);
            }
            
            // Always update zoom (works in both modes)
            this.updateZoom();
        });
        
        // Continuous actions (held keys) - only process if not following
        window.engineEvent.on('actionActive', (data) => {
            if (!this.isFollowing) {
                this.handleContinuousAction(data.action);
            }
        });
        
        // One-shot actions (key press events)
        window.engineEvent.on('actionStart', (data) => {
            this.handleAction(data.action);
        });
        
        // Mouse wheel zoom
        window.engineEvent.on('mouseWheel', (data) => {
            this.handleMouseWheel(data.deltaY);
        });
    }
    
    handleContinuousAction(action) {
        // Camera movement
        //if (action === 'cameraMoveUp') this.y -= this.adjustedMoveSpeed;
        if (action === 'cameraMoveUp') this.cameraVector.y -= this.adjustedMoveSpeed;
        if (action === 'cameraMoveDown') this.cameraVector.y += this.adjustedMoveSpeed;
        if (action === 'cameraMoveLeft') this.cameraVector.x -= this.adjustedMoveSpeed;
        if (action === 'cameraMoveRight') this.cameraVector.x += this.adjustedMoveSpeed;

        // Zoom
        if (action === 'zoomIn') this.targetZoom *= this.keyboardZoomIn;
        if (action === 'zoomOut') this.targetZoom *= this.keyboardZoomOut;
    }
    
    handleAction(action) {
        // Camera reset works in both modes
        if (action === 'cameraReset') {
            this.reset();
        }
        
        // Toggle following mode
        if (action === 'toggleFollow') {
            this.isFollowing = !this.isFollowing;
            console.log(`Camera following: ${this.isFollowing}`);
        }
    }
    
    updateZoom() {
        // Smooth zoom interpolation
        this.targetZoom = Math.max(this.minZoom, Math.min(this.targetZoom, this.maxZoom));
        this.zoom += (this.targetZoom - this.zoom) * this.zoomSpeed;
        this.zoom = Math.max(this.minZoom, Math.min(this.zoom, this.maxZoom));
    }
    
    reset() {
        this.cameraVector = new MathUtilities.Vector2(0, 0);
        this.targetZoom = 1;
        console.log('Camera reset to origin');
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    setFollowing(following) {
        this.isFollowing = following;
    }
    
    // Moves camera to target position (when following)
    follow(target) {
        if (target && target.x !== undefined && target.y !== undefined) {
            this.cameraVector = new MathUtilities.Vector2(target.x, target.y);
        }
    }
    
    // Handle mouse wheel zoom
    handleMouseWheel(deltaY) {
        // Zoom in when scrolling up (negative deltaY)
        // Zoom out when scrolling down (positive deltaY)
        this.targetZoom *= deltaY > 0 ? this.mouseZoomOut : this.mouseZoomIn;
    }
    
    // Get screen position from world position
    worldToScreen(worldX, worldY, canvas) {
        const screenX = (worldX - this.cameraVector.x) * this.zoom + canvas.width / 2;
        const screenY = (worldY - this.cameraVectorf.y) * this.zoom + canvas.height / 2;

        return { 
            x: screenX, 
            y: screenY 
        };
    }
    
    // Get world position from screen position
    screenToWorld(screenX, screenY, canvas) {
        const worldX = (screenX - canvas.width / 2) / this.zoom + this.cameraVector.x;
        const worldY = (screenY - canvas.height / 2) / this.zoom + this.cameraVector.y;

        return { 
            x: worldX, 
            y: worldY 
        };
    }
}

window.Camera = Camera;
