const jwt = require('jsonwebtoken')

const generateToken = (data) => {
    return jwt.sign(data, "SECURITY_INFORMATION_FOR_SESSION", { expiresIn: "7d" });
}

module.exports = generateToken;