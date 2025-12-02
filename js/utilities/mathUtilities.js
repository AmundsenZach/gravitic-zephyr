class MathUtilities {
    static convertToRadians(degrees) {
        return (degrees % 360) * Math.PI / 180;
    }

    static offset(eccentricity) {
        return Math.sqrt(1 - (eccentricity ** 2));
    }
}

window.MathUtilities = MathUtilities;
