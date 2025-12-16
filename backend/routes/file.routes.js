const express = require("express");
const { upload } = require("../config/multer");
const { auth } = require("../middleware/auth.middleware");
const { uploadFiles, listFiles, downloadFile, viewFile, updatePermissions, getPublicFileInfo, getFileLogs } = require("../controllers/file.controller");

const router = express.Router();
router.post("/upload", auth, upload.array("files"), uploadFiles);
router.get("/", auth, listFiles);
router.get("/download/:id", auth, downloadFile);
router.get("/view/:id", auth, viewFile);
router.get("/public/:id", getPublicFileInfo);
router.get("/:id/logs", auth, getFileLogs);
router.put("/:id/permissions", auth, updatePermissions);

module.exports = router;
