class EngineLoop {
    constructor() {
        // Initialize timing for delta time calculation
        this.lastTime = performance.now();

        // Store frame times for averaging
        this.frameTimes = []; // Array of {time, deltaTime}
        this.frameWindow = 1000; // 10 seconds in ms

        Rendering.init();
    }
    
    loop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Store current frame time
        this.frameTimes.push({ time: currentTime, deltaTime });

        // Remove frames older than 10 seconds
        while (
            this.frameTimes.length > 0 &&
            currentTime - this.frameTimes[0].time > this.frameWindow
        ) {
            this.frameTimes.shift();
        }

        // Calculate average frame time over last 10 seconds
        const sum = this.frameTimes.reduce((acc, f) => acc + f.deltaTime, 0);
        const avgFrameTime = this.frameTimes.length > 0 ? sum / this.frameTimes.length : 0;

        // Update interface with frame time and frame rate
        if (window.Interface) {
            window.Interface.updateFrameTime(deltaTime);
            window.Interface.updateFrameRate(1000 / deltaTime);

            // Optionally, add average frame time/rate to the interface
            if (window.Interface.updateAverageFrameTime) {
                window.Interface.updateAverageFrameTime(avgFrameTime);
            }
            if (window.Interface.updateAverageFrameRate) {
                window.Interface.updateAverageFrameRate(1000 / avgFrameTime);
            }
        }
        
        // Emit gameTick event with accurate delta time
        window.engineEvent.emit('gameTick', { 
            deltaTime: deltaTime
        });

        requestAnimationFrame(() => this.loop());
    }
}

window.EngineLoop = EngineLoop;
