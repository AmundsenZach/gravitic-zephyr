class RenderDebug {
    constructor(rendering) {
        this.rendering = rendering;
        this.debugMode = true;
    }

    // Toggle debug mode
    toggle() {
        this.debugMode = !this.debugMode;
    }

    // Called every frame to render debug overlays
    render() {
        if (!this.debugMode) return;

        const ctx = this.rendering.ctx;
        const canvas = this.rendering.canvas;
        const camera = this.rendering.camera;

        if (!ctx || !canvas || !camera) return;

        ctx.save();
        // Apply camera transform for world-space debug drawings if needed
        this.rendering.applyTransform();
        ctx.restore();

        // Show active controls (helpful for debugging input)
        this.renderControlsDebug();
    }

    // Show active input actions for debugging
    renderControlsDebug() {
        const activeActions = this.rendering.keyboardInput && this.rendering.keyboardInput.getActiveActions ? this.rendering.keyboardInput.getActiveActions() : [];
        if (activeActions.length === 0) return;

        const ctx = this.rendering.ctx;
        const canvas = this.rendering.canvas;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to screen coordinates

        const x = canvas.width - 200;
        const y = 120;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 10, y - 10, 190, activeActions.length * 20 + 20);

        // Title
        ctx.fillStyle = 'white';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Active Controls:', x, y);

        // Active actions
        activeActions.forEach((action, index) => {
            ctx.fillText(`• ${action}`, x, y + 20 + (index * 20));
        });

        ctx.restore();
    }
}

window.RenderDebug = RenderDebug;
