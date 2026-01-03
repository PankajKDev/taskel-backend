const prisma = require("../utils/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

const register = async (req, res) => {
  const { name, email, password } = await req.body;
  if (!email.includes("@") || password.length == 0) {
    return res.status(400).json({ error: "enter a valid email" });
  }

  try {
    //checking if user exist
    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return res.status(400).json({ error: "this email already exists" });
    }
    // generating salt
    const salt = await bcrypt.genSalt(10);
    // hashing password
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { name, email, password: hashedPassword };
    const savedUser = await prisma.user.create({ data: newUser });
    const token = generateToken(savedUser.id, res);
    return res
      .status(200)
      .json({ message: "register successfull", token: token });
  } catch (e) {
    return res.status(401).send({ message: "encountered an error", error: e });
  }
};

const login = async (req, res) => {
  const { email, password } = await req.body;
  if (!email.includes("@") || password.length == 0) {
    return res.status(400).json({ error: "enter a valid email/password" });
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(400).json({ error: "enter a valid email/password" });
  }
  // password validation
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "enter a valid email/password" });
  }
  const token = generateToken(user.id, res);

  return res.status(200).send({ message: "login successfull", token: token });
};

const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict",
  });
  return res.status(200).send({ message: "logged out" });
};

module.exports = { login, register, logout };
