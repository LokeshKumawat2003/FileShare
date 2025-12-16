const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const {
  shareWithUsers,
  generateLink,
  accessViaLink,
  getSharedFileInfo,
} = require("../controllers/share.controller");
const router = express.Router();
router.post("/user/:id", auth, shareWithUsers);
router.post("/link/:id", auth, generateLink);
router.get("/access/:token", accessViaLink);
router.get("/info/:token", getSharedFileInfo);

module.exports = router;
