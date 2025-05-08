const jwt = require("jsonwebtoken");
// there are three roles for the school: admin, teacher, student

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized (No token)" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        req.user = decoded;
        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "Access Denied (You don't have permission)",
          });
        }
        next();
      }
    } catch (error) {
      console.log("Error=>", error);
      res.status(401).json({
        success: false,
        message: "Unauthorized (Your Token is not valid!)",
      });
    }
  };
};

module.exports = authMiddleware;
