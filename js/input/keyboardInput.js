class KeyboardInput {
    constructor() {
        this.keys = {};
        this.properties = EngineConfig.KEYBOARD_PROPERTIES;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle keydown - emit actionStart once
        document.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keys[e.key] = true;
                this.emitActionEvent(e.key, 'actionStart');

                if (this.shouldPreventDefault(e.key, e)) {
                    e.preventDefault();
                }
            }
        });

        // Handle keyup - emit actionStop once
        document.addEventListener('keyup', (e) => {
            if (this.keys[e.key]) {
                this.keys[e.key] = false;
                this.emitActionEvent(e.key, 'actionStop');
            }
        });

        // Handle continuous input - emit actionActive every frame
        window.engineEvent.on('gameTick', () => {
            this.emitHeldActions();
        });

        // Clear all keys when window loses focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearAllKeys();
            }
        });

        window.addEventListener('blur', () => {
            this.clearAllKeys();
        });
    }

    // Emit actionActive for all currently held keys
    emitHeldActions() {
        for (const [key, isHeld] of Object.entries(this.keys)) {
            if (isHeld) {
                this.emitActionEvent(key, 'actionActive');
            }
        }
    }

    // Check if this key maps to an action and emit the appropriate event
    emitActionEvent(key, eventType) {
        for (const [action, keys] of Object.entries(this.properties)) {
            if (keys.includes(key)) {
                window.engineEvent.emit(eventType, { action, key });
            }
        }
    }

    // Determine if we should prevent default browser behavior
    shouldPreventDefault(key, event) {
        const mappedKeys = Object.values(this.properties).flat();
        return mappedKeys.includes(key) && !event.ctrlKey && !event.metaKey;
    }

    // Clear all tracked keys (used when focus is lost)
    clearAllKeys() {
        for (const key of Object.keys(this.keys)) {
            if (this.keys[key]) {
                this.keys[key] = false;
                this.emitActionEvent(key, 'actionStop');
            }
        }
    }
}

window.KeyboardInput = KeyboardInput;
