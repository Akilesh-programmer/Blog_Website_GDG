const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public auth endpoints
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
router.use(authController.protect);

// Example protected route (current user info placeholder)
router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Admin-only example (currently minimal; extend later)
router.use(authController.restrictTo('admin'));
router.get('/admin/ping', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'admin pong' });
});

module.exports = router;
