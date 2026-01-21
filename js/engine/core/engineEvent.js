class EngineEvent {
    static listeners = new Map();
    static debug = false;

    // Register an event listener
    static on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }

        this.listeners.get(eventName).push(callback);

        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    // Register a one-time listener
    static once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };

        this.on(eventName, wrapper);
    }

    // Unsubscribe a listener
    static off(eventName, callback) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    // Remove all listeners for an event
    static removeAllListeners(eventName) {
        if (eventName) {
            this.listeners.delete(eventName);
        } else {
            this.listeners.clear();
        }
    }

    // Emit an event
    static emit(eventName, data) {
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
    static getEventNames() {
        return Array.from(this.listeners.keys());
    }

    // Get listener count for an event (debugging)
    static listenerCount(eventName) {
        const listeners = this.listeners.get(eventName);
        return listeners ? listeners.length : 0;
    }
}

export { EngineEvent };
