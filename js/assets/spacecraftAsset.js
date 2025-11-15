class SpacecraftAsset {
    constructor(vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.vector = vector;

        this.rotation = 0;
    }
}

window.SpacecraftAsset = SpacecraftAsset;
