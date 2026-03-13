const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");

const ensureVendor = (req, res) => {
  if (!req.user?.id || req.user?.role !== "vendor") {
    res.status(403).json({ success: false, message: "Vendor access required." });
    return false;
  }
  if (!mongoose.isValidObjectId(req.user.id)) {
    res.status(400).json({ success: false, message: "Invalid vendor id in token." });
    return false;
  }
  return true;
};

exports.getReminders = async (req, res) => {
  if (!ensureVendor(req, res)) return;

  try {
    const reminders = await Reminder.find({ vendorId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, reminders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createReminder = async (req, res) => {
  if (!ensureVendor(req, res)) return;

  const title = String(req.body?.title || "").trim();
  const time = String(req.body?.time || "").trim();

  if (!title || !time) {
    return res.status(400).json({ success: false, message: "Title and time are required." });
  }

  try {
    const reminder = await Reminder.create({
      vendorId: req.user.id,
      title,
      time,
      done: false,
    });

    return res.status(201).json({ success: true, reminder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleReminder = async (req, res) => {
  if (!ensureVendor(req, res)) return;

  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, vendorId: req.user.id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found." });
    }

    reminder.done = !reminder.done;
    await reminder.save();

    return res.status(200).json({ success: true, reminder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReminder = async (req, res) => {
  if (!ensureVendor(req, res)) return;

  try {
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Reminder not found." });
    }

    return res.status(200).json({ success: true, message: "Reminder deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
