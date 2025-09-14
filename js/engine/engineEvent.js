class EngineEvent {
    constructor() {
        this.listeners = new Map();
    }

    // Register an event listener
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        
        this.listeners.get(eventName).push(callback);
    }

    // Emit an event
    emit(eventName, data) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
}

window.EngineEvent = EngineEvent;
