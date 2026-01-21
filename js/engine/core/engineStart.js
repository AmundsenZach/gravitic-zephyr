import { engineEvent } from './engineEvent.js'; // Singleton event emitter
import { EngineLoop } from './engineLoop.js';

import { KeyboardInput } from '../input/keyboardInput.js';
import { MouseInput } from '../input/mouseInput.js';

export let keyboardInput;
export let mouseInput;

const EngineStart = {
    init() {
        // Canvas Initiation
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Create global instances
        keyboardInput = new KeyboardInput();
        mouseInput = new MouseInput(this.canvas);

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
        engineEvent.emit('canvasResize', { width, height });
    }
}

export { EngineStart };
