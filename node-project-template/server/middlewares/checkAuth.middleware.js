import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the "Bearer <token>" format

    if (!token) {
        return res.status(403).json({ message: "No token entered." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        console.log('Decoded User:', user); // Log the decoded user to check the payload
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware/controller
    });
};
export default checkAuth;

