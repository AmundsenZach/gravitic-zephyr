class EngineEvent {
    constructor() {
        this.listeners = new Map();
        this.debug = false;
    }

    // Register an event listener
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        
        this.listeners.get(eventName).push(callback);
        
        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }
    
    // Register a one-time listener
    once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };
        
        this.on(eventName, wrapper);
    }
    
    // Unsubscribe a listener
    off(eventName, callback) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    // Remove all listeners for an event
    removeAllListeners(eventName) {
        if (eventName) {
            this.listeners.delete(eventName);
        } else {
            this.listeners.clear();
        }
    }

    // Emit an event
    emit(eventName, data) {
        if (this.debug) {
            console.log(`[Event] ${eventName}`, data);
        }
        
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            // Clone array to prevent issues if listeners modify the array
            listeners.slice().forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in listener for "${eventName}":`, error);
                }
            });
        }
    }
    
    // Get list of all event names (debugging)
    getEventNames() {
        return Array.from(this.listeners.keys());
    }
    
    // Get listener count for an event (debugging)
    listenerCount(eventName) {
        const listeners = this.listeners.get(eventName);
        return listeners ? listeners.length : 0;
    }
}

window.EngineEvent = EngineEvent;
