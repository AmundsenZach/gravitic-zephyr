const EngineStart = {
    init() {
        // Canvas Initiation
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Create global instances
        window.engineEvent = new EngineEvent();
        window.keyboardInput = new KeyboardInput();
        window.mouseInput = new MouseInput(this.canvas);

        // Set initial canvas size and emit event
        this.updateCanvasSize();
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
        });

        // Start the main engine loop
        const engineLoop = new EngineLoop();
        engineLoop.loop();
    },

    // Update canvas size and notify all systems via event
    updateCanvasSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        EngineStart.canvas.width = width;
        EngineStart.canvas.height = height;
        
        // Emit so camera and rendering can adjust
        window.engineEvent.emit('canvasResize', { width, height });
    }
}

window.EngineStart = EngineStart;
