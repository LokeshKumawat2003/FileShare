const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { register, login, getUsers, verifyToken } = require("../controllers/auth.controller");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/verify", auth, verifyToken);
router.get("/users", auth, getUsers);

module.exports = router;
