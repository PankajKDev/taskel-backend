const express = require("express");
const router = express.Router();
//controllers
const { register, login, logout } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
module.exports = router;
