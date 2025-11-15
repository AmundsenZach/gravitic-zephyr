class Camera {
    constructor() {
        this.constructorProperties();
        this.setupEventListeners();
        this.properties = EngineConfig.CAMERA_PROPERTIES;
        this.vector = new MathUtilities.Vector2(0, 0);
    }

    constructorProperties() {
        this.zoom = 1;
        this.targetZoom = 1;

        this.isFollowing = false;
        this.target = null;
    }

    get adjustedMoveSpeed() {
        return this.properties.moveSpeed / this.zoom;
    }

    setupEventListeners() {
        // Main update loop - runs every frame
        window.engineEvent.on('gameTick', () => {
            // If following a target, update camera position
            if (this.isFollowing && this.target) this.follow(this.target);

            // Always update zoom (works in both modes)
            this.updateZoom();
        });

        // Continuous actions (held keys) - only process if not following
        window.engineEvent.on('actionActive', (data) => {
            if (!this.isFollowing) this.handleContinuousAction(data.action);
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
        if (action === 'zoomIn') this.targetZoom *= this.properties.keyboardZoomIn;
        if (action === 'zoomOut') this.targetZoom *= this.properties.keyboardZoomOut;
    }

    // One-shot actions
    handleAction(action) {
        if (action === 'cameraReset') this.reset();
        if (action === 'toggleFollow') this.isFollowing = !this.isFollowing;
    }

    // Smooth zoom interpolation
    updateZoom() {
        this.targetZoom = Math.max(this.properties.minZoom, Math.min(this.targetZoom, this.properties.maxZoom));
        this.zoom += (this.targetZoom - this.zoom) * this.properties.zoomSpeed;
        this.zoom = Math.max(this.properties.minZoom, Math.min(this.zoom, this.properties.maxZoom));
    }

    reset() {
        this.vector = new MathUtilities.Vector2(0, 0);
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
            this.vector = new MathUtilities.Vector2(target.x, target.y);
        }
    }

    // Zoom in when scrolling up (negative deltaY), zoom out when scrolling down (positive deltaY)
    handleMouseWheel(deltaY) {
        this.targetZoom *= deltaY > 0 ? this.properties.mouseZoomOut : this.properties.mouseZoomIn;
    }
}

window.Camera = Camera;
