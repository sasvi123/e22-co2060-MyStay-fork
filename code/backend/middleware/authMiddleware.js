const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if the token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mystay_temporary_secret');

            // Attach the user data to the request object
            req.user = decoded;
            
            next(); // Move to the next function (the actual route)
        } catch (error) {
            console.error("Not authorized, token failed");
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

module.exports = { protect };