const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header (support both formats)
  let token = req.header("x-auth-token");
  
  // Si pas de x-auth-token, vérifier Authorization Bearer
  if (!token) {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Enlever "Bearer "
    }
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "Pas de token, autorisation refusée" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token non valide" });
  }
};
