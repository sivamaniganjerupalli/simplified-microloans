const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerVendor,
  loginVendor,
  getVendorById,
  getVendorDashboard,
  getVendorLoans,
  updateVendorProfile,
  uploadProfilePhoto,
  updateVendorSettings,
  recordRepayment,
  getActiveLoanInfo,
} = require('../controllers/vendorController');

const authMiddleware = require('../middlewares/auth');

// Multer setup: store uploaded images in /uploads with unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Route: Register vendor
router.post('/register', registerVendor);

// Route: Vendor login
router.post('/login', loginVendor);

// Route: Get vendor dashboard (protected)
router.get('/dashboard/:vendorId', authMiddleware, getVendorDashboard);

// Route: Get vendor loans (protected) - for modern UI
router.get('/loans/:vendorId', authMiddleware, getVendorLoans);

// Route: Upload profile photo (protected)
router.post('/:vendorId/upload-photo', authMiddleware, upload.single('image'), uploadProfilePhoto);
router.post('/:vendorId/upload-profile', authMiddleware, upload.single('profileImage'), uploadProfilePhoto);

router.put('/:vendorId/update', authMiddleware, updateVendorSettings);

// Route: Update vendor profile (protected) - for modern UI
router.put('/profile/:vendorId', authMiddleware, updateVendorProfile);

router.post('/repay', authMiddleware, recordRepayment);

// Get active loan info (lender wallet) for on-chain repayment
router.get('/:vendorId/active-loan-info', authMiddleware, getActiveLoanInfo);

// Alias route for profile style access
router.get('/profile/:vendorId', authMiddleware, getVendorById);

// Route: Get vendor by ID (keep this generic route last)
router.get('/:vendorId', getVendorById);



module.exports = router;
