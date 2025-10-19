const MathUtils = {
    // 2D Vector class for handling coordinate operations
    Vector2: class Vector2 {
        // Creates a new vector with optional x,y coordinates defaulting to 0
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        // Returns a new vector that is the sum of this vector and vector v
        add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }

        // Returns a new vector that is the difference of this vector and vector v
        subtract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }

        // Returns a new vector that is this vector multiplied by a scalar value
        multiply(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }

        // Adds v to this vector in-place (avoids allocation)
        addInPlace(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        // Multiplies this vector by scalar in-place (avoids allocation)
        multiplyInPlace(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        // Returns the squared length (useful to avoid sqrt when comparing distances)
        lengthSquared() {
            return this.x * this.x + this.y * this.y;
        }

        // Dot product with another vector
        dot(v) {
            return this.x * v.x + this.y * v.y;
        }

        // Create a copy of this vector
        clone() {
            return new Vector2(this.x, this.y);
        }

        // Set this vector's components
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }

        // Calculates the length (magnitude) of this vector using Pythagorean theorem
        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        // Returns a new vector in the same direction but with magnitude of 1
        normalize() {
            const mag = this.magnitude();
            // If magnitude is 0, return zero vector to avoid division by zero
            if (mag === 0) {
                return new Vector2();
            }
            
            return this.multiply(1 / mag);
        }

        // Rotate this vector by angle (radians) and return a new Vector2
        rotate(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return new Vector2(this.x * c - this.y * s, this.x * s + this.y * c);
        }

        // Rotate this vector in-place by angle (radians)
        rotateInPlace(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const nx = this.x * c - this.y * s;
            const ny = this.x * s + this.y * c;
            this.x = nx;
            this.y = ny;
            return this;
        }

        // Static helper to create a vector from an angle and optional length
        static fromAngle(angle, length = 1) {
            return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
        }
    }
};

window.MathUtils = MathUtils;
