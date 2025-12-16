const mongoose = require("mongoose");
const File = require("../models/File.js");
const { v4: uuid } = require("uuid");

const shareWithUsers = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user.id && (!file.sharedWith.some(id => id.toString() === req.user.id) || !file.sharedPermissions.canShare)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = req.body.users || [];

    const validUsers = users.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validUsers.length === 0) {
      return res.status(400).json({ message: "No valid user IDs provided" });
    }

    file.sharedWith = [...new Set([...file.sharedWith.map(id => id.toString()), ...validUsers])].map(id => new mongoose.Types.ObjectId(id));
    await file.save();

    file.logs.push({ user: req.user.id, action: 'share' });
    await file.save();

    res.json({ message: "Shared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const generateLink = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user.id && (!file.sharedWith.some(id => id.toString() === req.user.id) || !file.sharedPermissions.canShare)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    file.shareToken = uuid();
    await file.save();

    file.logs.push({ user: req.user.id, action: 'generate_link' });
    await file.save();

    res.json({ link: `/share/access/${file.shareToken}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const accessViaLink = async (req, res) => {
  try {
    const file = await File.findOne({ shareToken: req.params.token });
    if (!file) return res.status(403).json({ message: "Invalid link" });

    res.download(file.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSharedFileInfo = async (req, res) => {
  try {
    const file = await File.findOne({ shareToken: req.params.token });
    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({
      _id: file._id,
      filename: file.filename,
      originalName: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      owner: file.owner,
      sharedWith: file.sharedWith,
      sharedPermissions: file.sharedPermissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { shareWithUsers, generateLink, accessViaLink, getSharedFileInfo };
