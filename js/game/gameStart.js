// Initiation of the game assets and game loop

const GameStart = {
    init() {
        // Canvas Initiation
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Initialize the rendering system
        Rendering.init();

        // Canvas State Change
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.ctx = this.canvas.getContext('2d');
        });

        // Start game loop
        const gameLoop = new GameLoop();
        gameLoop.loop();
    }
}

window.GameStart = GameStart;
