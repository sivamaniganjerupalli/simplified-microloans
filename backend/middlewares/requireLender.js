// middleware/requireLender.js
module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "lender") {
    return res.status(403).json({ success: false, message: "Access denied. Lender role required." });
  }
  next();
};
