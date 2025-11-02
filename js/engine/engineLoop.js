class EngineLoop {
    constructor() {
        // Initialize timing for delta time calculation
        this.lastTime = performance.now();
        
        Rendering.init();
    }
    
    loop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Emit gameTick event with accurate delta time
        window.engineEvent.emit('gameTick', { 
            deltaTime: deltaTime 
        });
        
        requestAnimationFrame(() => this.loop());
    }
}

window.EngineLoop = EngineLoop;
