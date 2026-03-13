const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  applyLoan,
  repayLoan,
  approveLoan,
  getLoansByVendor,
  getAllLoans
} = require("../controllers/loanController");
const authMiddleware = require("../middlewares/auth");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png formats are allowed"), false);
    }
  },
});

const loanUploadMiddleware = (req, res, next) => {
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "businessImage", maxCount: 1 },
  ])(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  });
};

router.post(
  "/apply",
  authMiddleware,
  loanUploadMiddleware,
  applyLoan
);

router.post("/repay", authMiddleware, repayLoan);
router.put("/approve/:loanId", authMiddleware, approveLoan);
router.get("/vendor/:vendorId", getLoansByVendor);
router.get("/all", authMiddleware, getAllLoans);

module.exports = router;
