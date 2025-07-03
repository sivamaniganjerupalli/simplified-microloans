const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  applyLoan,
  repayLoan,
  approveLoan,
  getLoansByVendor,
  getAllLoans
} = require("../controllers/loanController");
const authMiddleware = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
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

router.post(
  "/apply",
  authMiddleware,
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "businessImage", maxCount: 1 },
  ]),
  applyLoan
);

router.post("/repay", authMiddleware, repayLoan);
router.put("/approve/:loanId", authMiddleware, approveLoan);
router.get("/vendor/:vendorId", getLoansByVendor);
router.get("/all", authMiddleware, getAllLoans);

module.exports = router;
