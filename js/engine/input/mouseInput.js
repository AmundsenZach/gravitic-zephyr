import { EngineEvent } from '../core/engineEvent.js';

class MouseInput {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupZoomListener();
    }

    setupZoomListener() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();

            // Just emit the event with the delta
            EngineEvent.emit('mouseWheel', {
                deltaY: e.deltaY,
                deltaX: e.deltaX,

                clientX: e.clientX,
                clientY: e.clientY
            });
        });
    }
}

export { MouseInput };
