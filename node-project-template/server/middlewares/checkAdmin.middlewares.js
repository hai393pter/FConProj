// middlewares/checkAdmin.js
export const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // User is an admin, proceed to the route
    } else {
      return res.status(403).json({
        statusCode: 403,
        message: 'Forbidden: Only admins can access this resource'
      });
    }
  };
  