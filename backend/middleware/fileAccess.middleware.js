const File = require("../models/file.model");

const fileAccess = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const userId = req.user.id;
    if (file.owner.toString() === userId || file.sharedWith.includes(userId)) {
      req.fileData = file;
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fileAccess };
