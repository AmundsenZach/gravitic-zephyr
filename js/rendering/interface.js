class Interface {
    static updateFrameRate(value) {
        document.getElementById('frameRate').textContent = value.toFixed(0);
    }

    static updateFrameTime(value) {
        document.getElementById('frameTime').textContent = value.toFixed(0);
    }

    static updateAverageFrameRate(value) {
        document.getElementById('averageFrameRate').textContent = value.toFixed(0);
    }

    static updateAverageFrameTime(value) {
        document.getElementById('averageFrameTime').textContent = value.toFixed(0);
    }
}

window.Interface = Interface;