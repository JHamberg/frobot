const crypto = require("crypto");

const random = {
    int256: (min, max) => {
        // Find next power of two
        const range = max - min;
        const square = 1 << 32 - Math.clz32(range);
        
        // Perform rejection sampling
        let candidate;
        do {
            // Generate truly random number between 1-255
            const bytes = crypto.randomBytes(1);
            candidate = bytes[0] % square; // Squeeze
        } while (candidate > range);

        // Use offset to push value in range 
        return candidate + min;
    }
}

module.exports = random;