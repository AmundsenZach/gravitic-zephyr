class EngineLoop {
    constructor() {
        // Initilizes the rendering system
        Rendering.init();

        // Listen for canvasResize event
        window.engineEvent.on('canvasResize', ({ width, height }) => {
            EngineStart.canvas.width = width;
            EngineStart.canvas.height = height;
            EngineStart.ctx = EngineStart.canvas.getContext('2d');
        });

        // Listen for a custom events
        window.engineEvent.on('gameTick', () => {
            // Handle per-tick updates here
        });
    }
    
    // Primary game loop
    loop() {
        // Emit a gameTick event each frame
        window.engineEvent.emit('gameTick');

        // Primary game refresh
        Rendering.render();
        requestAnimationFrame(() => this.loop());
    }
}

window.EngineLoop = EngineLoop;
