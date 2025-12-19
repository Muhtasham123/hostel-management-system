const crypto = require("crypto");

// Generate a random token
function generateToken() {
    return crypto.randomBytes(32).toString("hex"); // returns a hex string
}

module.exports = generateToken