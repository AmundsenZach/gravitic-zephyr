// V2 - Enhanced Keyboard Input with Camera Controls
class KeyboardInput {
    constructor() {
        // Raw key state tracking
        this.keys = {};
        
        // Action mapping system
        this.actionMappings = {
            // Movement controls (for future spacecraft)
            'thrustForward': ['ArrowUp', 'w'],
            'thrustBackward': ['ArrowDown', 's'],
            'rotateLeft': ['ArrowLeft', 'a'],
            'rotateRight': ['ArrowRight', 'd'],
            
            // Camera controls
            'cameraMoveUp': ['i', 'I'],
            'cameraMoveDown': ['k', 'K'],
            'cameraMoveLeft': ['j', 'J'],
            'cameraMoveRight': ['l', 'L'],
            'cameraReset': ['c', 'C'],
            'toggleFollow': ['f', 'F'],
            'zoomIn': ['+', '='],
            'zoomOut': ['-', '_'],
            
            // Debug and UI
            'toggleDebug': ['`', '~']
        };
        
        // Continuous vs one-shot actions
        this.continuousActions = [
            'thrustForward', 'thrustBackward',
            'rotateLeft', 'rotateRight',
            'cameraMoveUp', 'cameraMoveDown', 'cameraMoveLeft', 'cameraMoveRight',
            'zoomIn', 'zoomOut'
        ];
        
        // Store the last frame's actions to detect one-shot events
        this.previousActions = {};
        this.currentActions = {};
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Key press event
        document.addEventListener('keydown', (e) => {
            // Only register the keydown once (not for key repeat)
            if (!this.keys[e.key]) {
                this.keys[e.key] = true;
                
                // Prevent default browser behavior for game controls
                // but be careful not to block important shortcuts
                if (Object.values(this.actionMappings).flat().includes(e.key) && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                }
            }
        });
        
        // Key release event
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Handle page visibility changes (stop input when tab not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearAllKeys();
            }
        });
        
        // Handle window blur (stop input when window loses focus)
        window.addEventListener('blur', () => {
            this.clearAllKeys();
        });
    }
    
    // Stop all inputs when focus is lost
    clearAllKeys() {
        this.keys = {};
    }
    
    // Update action states based on current key states
    update() {
        // Store previous actions for one-shot detection
        this.previousActions = {...this.currentActions};
        
        // Reset current actions
        this.currentActions = {};
        
        // Check each action mapping against current key states
        for (const [action, keys] of Object.entries(this.actionMappings)) {
            // An action is active if ANY of its mapped keys are pressed
            this.currentActions[action] = keys.some(key => this.keys[key]);
        }
    }
    
    // Check if an action is currently active
    isActionActive(action) {
        return this.currentActions[action] || false;
    }
    
    // For continuous actions (like movement)
    isActionContinuous(action) {
        return this.continuousActions.includes(action);
    }
    
    // Check if an action was just pressed this frame (for one-shot actions)
    isActionJustPressed(action) {
        return this.currentActions[action] && !this.previousActions[action];
    }
    
    // Check if an action was just released this frame
    isActionJustReleased(action) {
        return !this.currentActions[action] && this.previousActions[action];
    }
    
    // Allow runtime remapping of keys
    remapAction(action, newKeys) {
        if (this.actionMappings[action]) {
            this.actionMappings[action] = Array.isArray(newKeys) ? newKeys : [newKeys];
        }
    }
    
    // Add a new action mapping
    addActionMapping(action, keys, isContinuous = false) {
        this.actionMappings[action] = Array.isArray(keys) ? keys : [keys];
        
        if (isContinuous && !this.continuousActions.includes(action)) {
            this.continuousActions.push(action);
        }
    }
    
    // Get a list of all currently active actions (useful for debugging)
    getActiveActions() {
        return Object.keys(this.currentActions).filter(action => this.currentActions[action]);
    }
}

window.KeyboardInput = KeyboardInput;
