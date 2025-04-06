// Primary game loop

class GameLoop {
    constructor() {
        // Any initialization can go here
    }
    
    loop() {
        Rendering.render();

        requestAnimationFrame(() => this.loop());
    }
}

window.GameLoop = GameLoop;