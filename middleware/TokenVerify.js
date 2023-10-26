const jwt = require("jsonwebtoken");
const prisma = require("../prisma/db");

const TokenVerfy = async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please Login Your Token Is Expire",
      });
    }
    const decoded = await jwt.verify(token, "UMAR");
    req.user = await prisma.user.findFirst({
      where: {
        id: decoded.id.id,
      },
    });
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = TokenVerfy;
