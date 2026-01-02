const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies["jwt"];
  try {
    //jwt.verify  returns a decrypted jwt using token and secret key
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verifyToken;
    next();
  } catch (e) {
    const environment = process.env.NODE_ENV === "dev";
    return res.status(400).send({
      message: "Unauthorised request",
      error: environment
        ? `${e}`
        : "please contact website owner if the error still persists",
    });
  }
};

module.exports = authMiddleware;
