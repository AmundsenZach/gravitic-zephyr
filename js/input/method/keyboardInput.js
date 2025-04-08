// Binding for keyboard and mouse controls

class KeyboardInput {
    constructor() {
      this.keys = {};
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      // Key is pressed
      document.addEventListener('keydown', (e) => {
        this.keys[e.key] = true;
      });
      // Key is released
      document.addEventListener('keyup', (e) => {
        this.keys[e.key] = false;
      });
    }
    
    isKeyPressed(key) {
      return this.keys[key] || false;
    }
  }

window.InputManager = InputManager;
