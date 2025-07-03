const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerVendor,
  loginVendor,
  getVendorById,
  getVendorDashboard,
  uploadProfilePhoto,
  updateVendorSettings,
  recordRepayment,
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

// Route: Get vendor by ID
router.get('/:vendorId', getVendorById);

// Route: Get vendor dashboard (protected)
router.get('/dashboard/:vendorId', authMiddleware, getVendorDashboard);

// Route: Upload profile photo (protected)
router.post('/:vendorId/upload-photo', authMiddleware, upload.single('image'), uploadProfilePhoto);

router.put('/:vendorId/update', authMiddleware, updateVendorSettings);

router.post('/repay', authMiddleware, recordRepayment);



module.exports = router;
