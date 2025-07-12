import jwt from "jsonwebtoken";
const userAuth = async (request, response, next) => {
  const { token } = request.cookies;

  if (!token) {
    return response.json({
      success: false,
      message: "Unauthorized, No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      request.user = { id: decoded.id }; // ✅ Assign to request.user
      next();
    } else {
      return response.json({
        success: false,
        message: "Unauthorized, login again",
      });
    }
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
export default userAuth;
