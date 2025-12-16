const File = require("../models/File.js");

const axios = require("axios");
const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = await Promise.all(
      req.files.map((file) =>
        File.create({
          filename: file.filename, 
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: file.path, 
          publicId: file.filename,
          owner: req.user.id,
        })
      )
    );

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const listFiles = async (req, res) => {
  try {
    const files = await File.find({
      $or: [{ owner: req.user.id }, { sharedWith: req.user.id }],
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (req.user.id !== file.owner.toString()) {
      file.logs.push({ user: req.user.id, action: 'download' });
      await file.save();
    }

    res.redirect(file.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const viewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (req.user.id !== file.owner.toString()) {
      file.logs.push({ user: req.user.id, action: 'view' });
      await file.save();
    }

    const response = await axios.get(file.url, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePermissions = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { canView, canDownload, canShare, canEdit } = req.body;
    file.sharedPermissions.canView =
      canView !== undefined ? canView : file.sharedPermissions.canView;
    file.sharedPermissions.canDownload =
      canDownload !== undefined
        ? canDownload
        : file.sharedPermissions.canDownload;
    file.sharedPermissions.canShare =
      canShare !== undefined ? canShare : file.sharedPermissions.canShare;
    file.sharedPermissions.canEdit =
      canEdit !== undefined ? canEdit : file.sharedPermissions.canEdit;
    await file.save();

    res.json({ message: "Permissions updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFileLogs = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('logs.user', 'name email');
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(file.logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPublicFileInfo = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({
      _id: file._id,
      filename: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      createdAt: file.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadFiles,
  listFiles,
  downloadFile,
  viewFile,
  updatePermissions,
  getPublicFileInfo,
  getFileLogs,
};
