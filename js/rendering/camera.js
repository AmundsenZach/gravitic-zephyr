class Camera {
    constructor() {
        ///this.initProperties();
        this.setupEventListeners();
        this.properties = EngineConfig.CAMERA_PROPERTIES;
        this.vector = new MathUtilities.Vector2(0, 0);
    }

    get adjustedMoveSpeed() {
        return this.properties.moveSpeed / this.properties.zoom;
    }

    setupEventListeners() {
        // Main update loop - runs every frame
        window.engineEvent.on('gameTick', () => {
            // If following a target, update camera position
            if (this.properties.isFollowing && this.properties.target) this.follow(this.properties.target);

            // Always update zoom (works in both modes)
            this.updateZoom();
        });

        // Continuous actions (held keys) - only process if not following
        window.engineEvent.on('actionActive', (data) => {
            if (!this.properties.isFollowing) this.handleContinuousAction(data.action);
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

    // Continuous actions
    handleContinuousAction(action) {
        // Camera movement
        if (action === 'cameraMoveUp') this.vector.y -= this.adjustedMoveSpeed;
        if (action === 'cameraMoveDown') this.vector.y += this.adjustedMoveSpeed;
        if (action === 'cameraMoveLeft') this.vector.x -= this.adjustedMoveSpeed;
        if (action === 'cameraMoveRight') this.vector.x += this.adjustedMoveSpeed;

        // Zoom
        if (action === 'zoomIn') this.properties.targetZoom *= this.properties.keyboardZoomIn;
        if (action === 'zoomOut') this.properties.targetZoom *= this.properties.keyboardZoomOut;
    }

    // One-shot actions
    handleAction(action) {
        if (action === 'cameraReset') this.reset();
        if (action === 'toggleFollow') this.properties.isFollowing = !this.properties.isFollowing;
    }

    // Smooth zoom interpolation
    updateZoom() {
        this.properties.targetZoom = Math.max(this.properties.minZoom, Math.min(this.properties.targetZoom, this.properties.maxZoom));
        this.properties.zoom += (this.properties.targetZoom - this.properties.zoom) * this.properties.zoomSpeed;
        this.properties.zoom = Math.max(this.properties.minZoom, Math.min(this.properties.zoom, this.properties.maxZoom));
    }

    reset() {
        this.vector = new MathUtilities.Vector2(0, 0);
        this.properties.targetZoom = 1;
        console.log('Camera reset to origin');
    }

    setTarget(target) {
        this.properties.target = target;
    }

    setFollowing(following) {
        this.properties.isFollowing = following;
    }

    // Moves camera to target position (when following)
    follow(target) {
        if (target && target.x !== undefined && target.y !== undefined) {
            this.vector = new MathUtilities.Vector2(target.x, target.y);
        }
    }

    // Zoom in when scrolling up (negative deltaY), zoom out when scrolling down (positive deltaY)
    handleMouseWheel(deltaY) {
        this.properties.targetZoom *= deltaY > 0 ? this.properties.mouseZoomOut : this.properties.mouseZoomIn;
    }
}

window.Camera = Camera;
