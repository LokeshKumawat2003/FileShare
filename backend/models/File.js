const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  url: String,
  publicId: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sharedPermissions: {
    canView: { type: Boolean, default: true },
    canDownload: { type: Boolean, default: true },
    canShare: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: false }
  },
  logs: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    timestamp: { type: Date, default: Date.now }
  }],
  shareToken: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
