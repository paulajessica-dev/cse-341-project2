const { isTokenBlacklisted } = require('../models/blacklist');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

async function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });    

    if (await isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Token is invalid. Please login again.' });
    }

    try {
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authenticateToken;
