const EngineStart = {
    init() {
        // Canvas Initiation
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Canvas State Change via EngineEvent
        window.engineEvent = new EngineEvent();
        window.addEventListener('resize', () => {
            window.engineEvent.emit('canvasResize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        });

        // Start the main engine loop
        const engineLoop = new EngineLoop();
        engineLoop.loop();
    }
}

window.EngineStart = EngineStart;
