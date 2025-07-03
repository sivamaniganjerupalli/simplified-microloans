const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT from Authorization header.
 * Adds decoded user info to req.user on success.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header exists and is correctly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided or token format is incorrect.',
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token with the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dummy_secret');
    req.user = decoded; // Attach the decoded data to the request object
    next(); // Pass the request to the next middleware or route handler
  } catch (err) {
    // Catch any error thrown during token verification
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
