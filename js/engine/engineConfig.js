class EngineConfig {
    // Physics and simulation constants
    static TEMP_MULTIPLIER = 500; // Temporary gravitational constant multiplier for testing
    static G = 1;
    static BACKGROUND_DENSITY = 2000;

    // Key mappings for actions
    static ACTION_MAPPINGS = {
        'thrustForward': ['ArrowUp', 'w'],
        'rotateLeft': ['ArrowLeft', 'a'],
        'rotateRight': ['ArrowRight', 'd'],

        'cameraMoveUp': ['i', 'I'],
        'cameraMoveDown': ['k', 'K'],
        'cameraMoveLeft': ['j', 'J'],
        'cameraMoveRight': ['l', 'L'],
        'cameraReset': ['c', 'C'],

        'zoomIn': ['+', '='],
        'zoomOut': ['-', '_'],

        'toggleFollow': ['f', 'F'],
        'toggleDebug': ['`', '~']
    };
}

window.EngineConfig = EngineConfig;
