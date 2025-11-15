class EngineConfig {
    // Physics and simulation constants
    static TEMP_MULTIPLIER = 500; // Temporary gravitational constant multiplier for testing
    static G = 1;
    static BACKGROUND_DENSITY = 2000;

    // Key mappings for actions
    static KEYBOARD_PROPERTIES = {
        'thrustForward': ['ArrowUp', 'w', 'W'],
        'rotateLeft': ['ArrowLeft', 'a', 'A'],
        'rotateRight': ['ArrowRight', 'd', 'D'],

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

    static CAMERA_PROPERTIES = {
        minZoom: 0.1,
        maxZoom: 5,

        keyboardZoomIn: 1.02,
        keyboardZoomOut: 0.98,

        mouseZoomIn: 1.05,
        mouseZoomOut: 0.8,
        zoomSpeed: 0.025,

        moveSpeed: 5,
    };
}

window.EngineConfig = EngineConfig;
