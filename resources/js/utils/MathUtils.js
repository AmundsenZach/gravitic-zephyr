const MathUtils = {
    Vector2: class Vector2 {
        // CONSTRUCTION & INITIALIZATION
        
        // Creates a new Vector2 with x and y coordinates (default: 0, 0)
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        // Sets the vector's x and y components
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }

        // Resets the vector to (0, 0)
        reset() {
            this.x = 0;
            this.y = 0;
            return this;
        }

        // Creates a copy of this vector
        clone() {
            return new Vector2(this.x, this.y);
        }

        // Creates a vector from an angle (radians) and length
        static fromAngle(angle, length = 1) {
            return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
        }

        // Returns a zero vector (0, 0)
        static get zero() {
            return new Vector2(0, 0);
        }

        // Returns a one vector (1, 1)
        static get one() {
            return new Vector2(1, 1);
        }

        // Returns an up vector (0, -1)
        static get up() {
            return new Vector2(0, -1);
        }

        // Returns a down vector (0, 1)
        static get down() {
            return new Vector2(0, 1);
        }

        // Returns a left vector (-1, 0)
        static get left() {
            return new Vector2(-1, 0);
        }

        // Returns a right vector (1, 0)
        static get right() {
            return new Vector2(1, 0);
        }

        // BASIC ARITHMETIC

        // Addition - Adds another vector and returns a new vector
        add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }

        // Adds another vector to this vector (mutates this)
        addInPlace(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        // Adds two vectors and returns a new vector
        static add(v1, v2) {
            return new Vector2(v1.x + v2.x, v1.y + v2.y);
        }

        // Subtraction - Subtracts another vector and returns a new vector
        subtract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }

        // Subtracts another vector from this vector (mutates this)
        subtractInPlace(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        // Subtracts v2 from v1 and returns a new vector
        static subtract(v1, v2) {
            return new Vector2(v1.x - v2.x, v1.y - v2.y);
        }

        // Multiplication - Multiplies the vector by a scalar and returns a new vector
        multiply(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }

        // Multiplies this vector by a scalar (mutates this)
        multiplyInPlace(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        // Multiplies a vector by a scalar and returns a new vector
        static multiply(v, scalar) {
            return new Vector2(v.x * scalar, v.y * scalar);
        }

        // Division - Divides the vector by a scalar and returns a new vector
        divide(scalar) {
            return new Vector2(this.x / scalar, this.y / scalar);
        }

        // Divides this vector by a scalar (mutates this)
        divideInPlace(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }

        // Divides a vector by a scalar and returns a new vector
        static divide(v, scalar) {
            return new Vector2(v.x / scalar, v.y / scalar);
        }

        // Negation - Returns a vector with opposite direction
        negate() {
            return new Vector2(-this.x, -this.y);
        }

        // Negates this vector (mutates this)
        negateInPlace() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }

        // VECTOR PROPERTIES

        // Returns the length (magnitude) of the vector
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        // Returns the squared length of the vector (faster than length())
        lengthSquared() {
            return this.x * this.x + this.y * this.y;
        }

        // Returns a normalized version of this vector (length = 1)
        normalize() {
            const len = this.length();
            return len > 0 ? this.divide(len) : new Vector2(0, 0);
        }

        // Normalizes this vector to length 1 (mutates this)
        normalizeInPlace() {
            const len = this.length();
            if (len > 0) {
                this.x /= len;
                this.y /= len;
            }
            return this;
        }

        // Returns a normalized version of a vector
        static normalize(v) {
            const len = Math.sqrt(v.x * v.x + v.y * v.y);
            return len > 0 ? new Vector2(v.x / len, v.y / len) : new Vector2(0, 0);
        }

        // VECTOR MATH

        // Returns the dot product with another vector
        dot(v) {
            return this.x * v.x + this.y * v.y;
        }

        // Returns the dot product of two vectors
        static dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        }

        // Returns the 2D cross product (scalar) with another vector
        // Positive = counterclockwise rotation
        cross(v) {
            return this.x * v.y - this.y * v.x;
        }

        // Returns the 2D cross product of two vectors
        static cross(v1, v2) {
            return v1.x * v2.y - v1.y * v2.x;
        }

        // Linear interpolation between this vector and another
        // t = 0 returns this, t = 1 returns v, t = 0.5 returns midpoint
        lerp(v, t) {
            return new Vector2(
                this.x + (v.x - this.x) * t,
                this.y + (v.y - this.y) * t
            );
        }

        // Linear interpolation between two vectors
        static lerp(v1, v2, t) {
            return new Vector2(
                v1.x + (v2.x - v1.x) * t,
                v1.y + (v2.y - v1.y) * t
            );
        }

        // DISTANCE & ANGLES

        // Returns the distance to another vector
        distance(v) {
            const dx = v.x - this.x;
            const dy = v.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Returns the squared distance to another vector (faster, no sqrt)
        distanceSquared(v) {
            const dx = v.x - this.x;
            const dy = v.y - this.y;
            return dx * dx + dy * dy;
        }

        // Returns the distance between two vectors
        static distance(v1, v2) {
            const dx = v2.x - v1.x;
            const dy = v2.y - v1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Returns the squared distance between two vectors
        static distanceSquared(v1, v2) {
            const dx = v2.x - v1.x;
            const dy = v2.y - v1.y;
            return dx * dx + dy * dy;
        }

        // Returns the angle in radians from this vector to another
        angleTo(v) {
            return Math.atan2(v.y - this.y, v.x - this.x);
        }

        // Returns the angle of this vector from the positive x-axis
        angle() {
            return Math.atan2(this.y, this.x);
        }

        // Returns the angle between two vectors
        static angleBetween(v1, v2) {
            return Math.atan2(v2.y - v1.y, v2.x - v1.x);
        }

        // TRANSFORMATIONS

        // Rotates the vector by an angle (radians) and returns a new vector
        rotate(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector2(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos
            );
        }

        // Rotates this vector by an angle (mutates this)
        rotateInPlace(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const newX = this.x * cos - this.y * sin;
            const newY = this.x * sin + this.y * cos;
            this.x = newX;
            this.y = newY;
            return this;
        }

        // Returns a perpendicular vector (rotated 90° counterclockwise)
        perpendicular() {
            return new Vector2(-this.y, this.x);
        }

        // Makes this vector perpendicular (mutates this)
        perpendicularInPlace() {
            const temp = this.x;
            this.x = -this.y;
            this.y = temp;
            return this;
        }

        // CONSTRAINTS & LIMITS

        // Clamps the vector's length between min and max
        clamp(min, max) {
            const len = this.length();
            if (len === 0) return new Vector2(0, 0);
            if (len < min) return this.normalize().multiply(min);
            if (len > max) return this.normalize().multiply(max);
            return this.clone();
        }

        // Clamps this vector's length between min and max (mutates this)
        clampInPlace(min, max) {
            const len = this.length();
            if (len === 0) return this;
            if (len < min) {
                this.normalizeInPlace().multiplyInPlace(min);
            } else if (len > max) {
                this.normalizeInPlace().multiplyInPlace(max);
            }
            return this;
        }

        // Limits the vector's length to a maximum value
        limit(max) {
            const len = this.length();
            if (len > max && len > 0) {
                return this.normalize().multiply(max);
            }
            return this.clone();
        }

        // Limits this vector's length to a maximum value (mutates this)
        limitInPlace(max) {
            const len = this.length();
            if (len > max && len > 0) {
                this.normalizeInPlace().multiplyInPlace(max);
            }
            return this;
        }

        // COMPARISON & UTILITY

        // Checks if this vector equals another vector (with tolerance for floating point)
        equals(v, epsilon = 0.0001) {
            return Math.abs(this.x - v.x) < epsilon && 
                   Math.abs(this.y - v.y) < epsilon;
        }

        // Checks if this vector is zero (with tolerance for floating point)
        isZero(epsilon = 0.0001) {
            return Math.abs(this.x) < epsilon && Math.abs(this.y) < epsilon;
        }

        // Returns a string representation of the vector
        toString() {
            return `Vector2(${this.x}, ${this.y})`;
        }

        // Converts the vector to an array [x, y]
        toArray() {
            return [this.x, this.y];
        }

        // Converts the vector to an object {x, y}
        toObject() {
            return { x: this.x, y: this.y };
        }
    }
};

window.MathUtils = MathUtilits;
