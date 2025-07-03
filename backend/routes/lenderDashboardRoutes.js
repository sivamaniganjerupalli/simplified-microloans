const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const authenticate = require("../middlewares/authenticate"); // ✅ Auth middleware

const {
  getLenderDashboard,
  registerLender,
  loginLender,
  uploadPhoto,
  updateLenderSettings,
  getLenderTransactions,
  recordTransaction, // Optional: to record a transaction manually
  getLenderLoans, 
  approveLoan,
  getAllLoans,
  rejectLoan,
  getLenderById,
} = require("../controllers/lenderController");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

// --------------------
// ✅ Public Routes
// --------------------
router.post("/register", registerLender);
router.post("/login", loginLender);

// --------------------
// 🔐 Protected Routes
// --------------------
router.get("/dashboard/:lenderId", authMiddleware, getLenderDashboard);

router.post(
  "/upload-photo/:lenderId",
  authMiddleware,
  upload.single("image"),
  uploadPhoto
);

router.put("/update/:lenderId", authMiddleware, updateLenderSettings);

router.get("/transactions/:lenderId", authMiddleware, getLenderTransactions);

// 📝 Optional: Manual transaction recording endpoint (for testing or admin use)
router.post("/transactions/record", authMiddleware, recordTransaction);

router.get("/:lenderId/loans", authMiddleware, getLenderLoans);
router.put("/loans/:loanId/approve", authMiddleware, approveLoan);
router.get("/all-loans", authMiddleware, getAllLoans);
router.put("/loans/:loanId/reject", authMiddleware, rejectLoan);
// Corrected unique route for profile
router.get("/profile/:lenderId", authMiddleware, getLenderById);




module.exports = router;
