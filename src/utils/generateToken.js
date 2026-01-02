const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const payload = { id: userId };
  // payload is simple js object that contain data to store in token
  // also called claims section of jwt

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict",
    maxAge: 604800000, // 7 days
  });
  return token;
};
module.exports = { generateToken };

// "jwt" is the name of cookie here
// token is the value being stored
// httpOnly prevents client side javascript
//secure in production the cookie should only be sent over https
// samesite strict prevents csrf attacks

// when server receives a token it uses the same secret to recalculate the signature.If the ca
