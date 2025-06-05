const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

router.get('/:id', statusController.getStatus);

module.exports = router; 