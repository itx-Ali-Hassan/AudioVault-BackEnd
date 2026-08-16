const jwt = require('jsonwebtoken');
const prefix = 'SpiderMan '

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(prefix)) return res.status(401).json({ error: 'Unauthorized access' });

    const token = authHeader.substring(prefix.length); // Remove 'SpiderMan ' prefix

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware