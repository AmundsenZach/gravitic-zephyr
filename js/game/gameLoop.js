// Primary game loop

class GameLoop {
    loop() {
        gameEvent;
        Rendering.render();

        requestAnimationFrame(() => this.loop());
    }
}

window.GameLoop = GameLoop;
